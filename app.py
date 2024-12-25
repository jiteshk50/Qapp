from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result', methods=['POST'])
def result():
    if request.method == 'POST':
        user_answers = request.form
        processed_answers = {}
        for question, answer in user_answers.items():
            if question.startswith('q'):
                try:
                    processed_answers[int(question[1:])] = answer
                except ValueError:
                    pass

        score = calculate_score(processed_answers)
        return render_template('result.html', answers=processed_answers, score=score)
    return redirect('/')

def calculate_score(answers):
    correct_answers = {1: 'a', 2: 'c'}
    score = 0
    for question, answer in answers.items():
        if answer == correct_answers.get(question):
            score += 1
    return score

if __name__ == '__main__':
    app.run(debug=True)