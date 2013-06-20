from bottle import route, run, template, static_file


@route('/')
def index(name='World'):
    # The index page
    return template('index', name=name)


@route('/static/<filename:path>')
def server_static(filename):
    # Static files
    return static_file(filename, root='./assets')


run(host='localhost', port=8080)
