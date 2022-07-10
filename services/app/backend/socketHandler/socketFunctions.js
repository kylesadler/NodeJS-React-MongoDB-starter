const config = require("../../config");
const socketEvents = config.socketEvents;
const simulationEvents = socketEvents.simulation;
const { readdir, readFile } = require("fs/promises");
const path = require("path");
const NetworkSimulation = require("../../simulatorv1/Simulations/NetworkSimulation");
const PipeNetwork = require("../../simulatorv1/PipedreamNetwork/PipeNetwork/PipeNetwork");
const defaultSimulatorConstants = require("../../simulatorv1/constants");
const defaultConfig = require("../../simulatorv1/config");
const {
  randomBetweenLocations,
  uniformlyDistributed,
} = require("../../simulatorv1/orderGenerators");
const MiddleMileSimulation = require("../../simulatorv1/Simulations/MiddleMileSimulation");
const DeliveryDriverSimulation = require("../../simulatorv1/Simulations/DeliveryDriverSimulation");

const constantRandomSeed = 1;
const simulationSteps = 60 * 60 * 5;
const stepsPerSecond = 20;
// const logLevel = "info";
const logLevel = "verbose";
const logIntervalSteps = stepsPerSecond / 4;
const avgNewOrdersPerHour = 80;
// const avgNewOrdersPerHour = 1000;
// const maxTimestep = Math.max(simulationSteps / 2, simulationSteps - 60 * 60);
const maxTimestep = undefined;

const defaultParams = () => {
  return {
    constants: defaultSimulatorConstants,
    config: {
      ...defaultConfig,
      numRobots: 5,
      avgNewOrdersPerHour,

      ...(config || {}),
      randomSeed: constantRandomSeed,
      simulationSteps,
      stepsPerSecond,
      logIntervalSteps,
      logLevel,
    },
  };
};

const getConfig = (overrideConfig) => {
  // returns full configuration object
  return {
    ...defaultParams().config,
    ...(overrideConfig || {}),
  };
};

const startSimulation = ({ initSimulation, socket }) => {
  return async (args) => {
    if (socket.simulation) {
      return socket.simulation.start();
    }

    socket.simulation = await initSimulation(args);

    socket.emit(
      simulationEvents.GET_SIMULATION_JSON,
      socket.simulation.getSimulationJSON()
    );

    socket.simulation.onStateLogged((state) => {
      socket.emit(simulationEvents.GET_STATE_JSON, state);
    });

    socket.simulation.start();
  };
};

const toBounds = (network) => {
  return {
    min: { lat: network.bounds.south, lng: network.bounds.west },
    max: { lat: network.bounds.north, lng: network.bounds.east },
  };
};

const startNetworkSimulation = ({ socket, nanoSocket }) => {
  return startSimulation({
    socket,
    initSimulation: async ({ networkConfig, constants, config }) => {
      // each time pipenetwork is created, NetworkLocation.id increments
      const network = new PipeNetwork();
      await network.load(networkConfig);
      const { numRobots, avgNewOrdersPerHour } = getConfig(config);

      return new NetworkSimulation({
        network,
        numRobots,
        generateOrders: randomBetweenLocations({
          interval: Math.round((60 * 60) / avgNewOrdersPerHour),
          locations: network.portals,
          maxTimestep,
        }),
        constants,
        config: config || {},
      });
    },
  });
};

const startMiddleMileSimulation = ({ socket, nanoSocket }) => {
  return startSimulation({
    socket,
    initSimulation: async ({ networkConfig, constants, config }) => {
      const network = new PipeNetwork();
      await network.load(networkConfig);

      const { numRobots, avgNewOrdersPerHour } = getConfig(config);

      const bounds = toBounds(network);

      return new MiddleMileSimulation({
        network,
        numRobots,
        // numDrivers: network.portals.length * 2,
        numDrivers: network.portals.length,
        bounds,

        generateOrders: uniformlyDistributed({
          interval: Math.round((60 * 60) / avgNewOrdersPerHour),
          bounds,
          maxTimestep,
        }),

        constants,

        config: {
          // logLevel: "debug",
          ...(config || {}),
        },
      });
    },
  });
};

const startDeliveryDriverSimulation = ({ socket, nanoSocket }) => {
  return startSimulation({
    socket,
    initSimulation: async ({ networkConfig, constants, config }) => {
      const network = new PipeNetwork();

      await network.load(networkConfig);

      const { avgNewOrdersPerHour } = getConfig(config);

      const bounds = toBounds(network);

      return new DeliveryDriverSimulation({
        network,
        // numDrivers: network.portals.length * 2,
        numDrivers: network.portals.length,
        bounds,

        generateOrders: uniformlyDistributed({
          interval: Math.round((60 * 60) / avgNewOrdersPerHour),
          bounds,
          maxTimestep,
        }),

        constants,

        config: {
          // logLevel: "debug",
          ...(config || {}),
        },
      });
    },
  });
};

// const getPastSimulations = ({ socket, nanoSocket }) => {
//   return async (params) => {
//     const simulationsDir = path.join(".", "frontend", "dist", "simulations");
//     let simulations = [];

//     try {
//       const files = await readdir(simulationsDir);

//       for (const file of files) {
//         try {
//           const configPath = path.join(simulationsDir, file, "config.json");
//           const fileContents = await readFile(configPath);
//           const config = JSON.parse(fileContents.toString().trim());

//           simulations.push({
//             name: file,
//             config,
//           });
//         } catch (err) {}
//       }
//     } catch (err) {
//       console.error(err);
//     }

//     socket.emit(socketEvents.SIMULATOR__GET_PAST_SIMULATIONS, simulations);
//   };
// };

module.exports = [
  // { event: socketEvent, handler: function(socket) => ((params) => {}) }
  {
    event: socketEvents.DISCONNECT,
    handler: ({ socket, nanoSocket }) => {
      return (reason) => {
        console.log("disconnect: ", reason);
        // TODO make able to reconnect to a simulation
        if (socket.simulation) socket.simulation.end();
      };
    },
  },

  {
    event: socketEvents.HARDWARE_DEMO__UPDATE_VALUES,
    handler: ({ socket, nanoSocket }) => {
      return (params) => {
        if (nanoSocket) nanoSocket.send(JSON.stringify(params));
      };
    },
  },

  {
    event: simulationEvents.GET_DEFAULT_PARAMS,
    handler: ({ socket, nanoSocket }) => {
      return (params) => {
        socket.emit(simulationEvents.GET_DEFAULT_PARAMS, defaultParams());
      };
    },
  },

  {
    event: simulationEvents.NETWORK_SIMULATION,
    handler: startNetworkSimulation,
  },

  {
    event: simulationEvents.MIDDLE_MILE_SIMULATION,
    handler: startMiddleMileSimulation,
  },

  {
    event: simulationEvents.DELIVERY_DRIVER_SIMULATION,
    handler: startDeliveryDriverSimulation,
  },

  {
    event: simulationEvents.GET_SIMULATION_JSON,
    handler: ({ socket, nanoSocket }) => {
      return () => {
        if (socket.simulation)
          socket.emit(
            simulationEvents.GET_SIMULATION_JSON,
            socket.simulation.getSimulationJSON()
          );
      };
    },
  },

  // {
  //   event: socketEvents.SIMULATOR__GET_PAST_SIMULATIONS,
  //   handler: getPastSimulations,
  // },

  {
    event: simulationEvents.PAUSE,
    handler: ({ socket, nanoSocket }) => {
      return () => {
        if (socket.simulation) socket.simulation.pause();
      };
    },
  },
];
