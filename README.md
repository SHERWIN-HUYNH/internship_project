Folder `endpoints` defines every endpoints, duh :v

Folder `services` defines business logic 

When running, server.py will import all the endpoints in `endpoints` folder, then the endpoints will use the services in `services` folder, then services will use the utility in `utils` folder to access db, upload images, ...

To handle exception, define a custome exception and put it in `utils/exceptions.py`, then define an exception endpoints in `endpoints/exceptions.py` which handle it globally. You can then raise it anywhere in the code. 