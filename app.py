from boggle import Boggle
from flask import Flask, request, render_template, redirect, session

app = Flask(__name__)

app.config['SECRET_KEY'] = 'ravi'

boggle_game = Boggle()

@app.route('/')
def home_view():
    return render_template('home.html')

@app.route('/start-game')
def game_start():
    board = boggle_game.make_board()
    session['board'] = board
    return redirect('/game')

@app.route('/game')
def game_view():
    return render_template('game.html')

@app.route('/guess/<guess>')
def guess():
    if guess not in boggle_game.words:
        json_data = {'result' : 'not-a-word'}
    elif boggle_game.find(session['board'],guess):
        json_data = {'result' : 'ok'}
    else:
        json_data = {'result' : 'not-on-board'}
    json_resp = jsonify(json_data)
    return json_resp
