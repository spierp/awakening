# Awakening - A Flask-based game for web

TODO(spierp): Add inspiring intro about the game.

## Running the game (Flask App)
### Development:
```
$ python webapp/run.py
```

Play the game by going to [http://localhost:5000](http://localhost:5000)

### Via Gunicorn (more production-ish):

From the root directory:

```
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

* -w : number of worker
* -b : Socket to bind

### Build and run via a Docker Instance

In image building all files and directories will be added into the image.

```
# Repeat the following line whenever a change is made:
docker build -t awakening-app .

# Start docker in an interactive shell:
docker run -p 8000:8000 -it --rm --name awakening awakening-app
```
