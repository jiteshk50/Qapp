from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result', methods=['POST'])
def result():
    # Placeholder for actual result processing logic
    user_answers = request.form
    return render_template('result.html', answers=user_answers)

if __name__ == '__main__':
    app.run(debug=True)
