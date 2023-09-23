# Awakening - A Flask-based game for web

TODO(spierp): Add inspiring intro about the game.

## Running the game (Flask App)
### Development:
```
# Create a clean virtual env for the game development:
python3 -m venv game_venv

# Activate the venv:
source game_venv/bin/activate
pip install --upgrade -r requirements.txt

# Run the Flask dev server:
python webapp/run.py

# Get out of the venv when done:
deactivate
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
