import requests, json

from bottle import route, run, template, static_file, abort, install, request, response
from imagga.color import ColorAPIClient

# The database
from bottle_sqlite import SQLitePlugin
install(SQLitePlugin(dbfile='database.db'))

# Import the config file
from config import *


class Instagram(object):
    """A small class for fetching photos from Instagram"""
    def __init__(self, client_id):
        super(Instagram, self).__init__()

        self.api_url = 'https://api.instagram.com/v1'
        self.client_id = client_id

    def get(self, resource, params=list()):
        url = self.api_url

        if resource == '/media/popular':
            url = self.append_client_id(url+resource)
        else:
            return False

        try:
            data = self.fetch_data(url)
            return self.parse_data(data)
        except:
            return False

    def append_client_id(self, url):
        return url + '?client_id=' + self.client_id

    def fetch_data(self, url):
        return requests.get(url)

    def parse_data(self, data):
        return data.json()


class Application(object):
    """The application's main class"""
    def __init__(self):
        super(Application, self).__init__()

        self.imagga = ColorAPIClient(api_key=IMAGGA_API_KEY, api_secret=IMAGGA_API_SECRET, endpoint=IMAGGA_API_ENDPOINT)
        self.instagram = Instagram(client_id=INSTAGRAM_CLIENT_ID)

    def set_db(self, db):
        self.db = db

    def get_photos(self):
        photos = list()

        result = self.db.execute('SELECT uid, url FROM photos')
        if not result.rowcount:
            photos = self.update_photos()
        else:
            rows = result.fetchall()
            for row in rows:
                photos.append({
                    'id': row['uid'],
                    'url': row['url']
                })

        return photos

    def update_photos(self):
        instagram_data = self.instagram.get('/media/popular')['data']
        imagga_photos = list()

        for photo in instagram_data:
            photo_id = photo['created_time']
            photo_url = photo['images']['low_resolution']['url']
            result = self.db.execute("INSERT INTO photos (uid, url) VALUES ("+photo_id+", '"+photo_url+"')")

            if result:
                new_photo = {
                    'id': photo_id,
                    'url': photo_url
                }

                imagga_photos.append(new_photo)

        try:
            self.imagga.colors_by_urls(imagga_photos)
        except:
            return False

        return self.get_photos()

    def match_photos(self, params):
        if not params:
            return False

        params = params.split(',')
        color_combination = list()
        iterator = 0
        for i in range(len(params)/4):
            color_combination.append({
                'percent': params[iterator],
                'r': params[iterator+1],
                'g': params[iterator+2],
                'b': params[iterator+3]
            })
            iterator += 4

        import pdb; pdb.set_trace()
        try:
            matching_photos = self.imagga.rank_similar_color(color_combination, 4500)
            return matching_photos['rank_similarity']
        except:
            return False


app = Application()


@route('/')
def index():
    # The index page
    return template('index')


@route('/api/photos/<method>')
def api(method='get', db=None):
    # The pseudo API
    app.set_db(db)

    output = list()
    params = request.query.get('params')

    if method == 'get':
        output = app.get_photos()
    elif method == 'update':
        output = app.update_photos()
    elif method == 'match' and params:
        output = app.match_photos(params)
    else:
        abort(404, 'No such method.')

    response.set_header('Content-Type', 'application/json')
    return template(json.dumps(output))


@route('/static/<filename:path>')
def server_static(filename):
    # Static files
    return static_file(filename, root='./assets')


run(host='localhost', port=8080)
