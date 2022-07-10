microservices = [
    'app',
    'postgres'
    # add services here
]

for service in microservices:
    load_dynamic(os.path.join("services", service, "Tiltfile"))
