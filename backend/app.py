from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# 400 error, 201 successfully created

# initialization
app = Flask(__name__)

# configure database, todo.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'

# Initialize plugin
db = SQLAlchemy(app)
# set for ReactJS
CORS(app) 

# define database model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    # send to react
    def to_json(self):
        return {
            "id": self.id,
            "content": self.content,
            "completed": self.completed
        }
    
    #show content
    def __repr__(self):
        return '<Todo %r>' % self.content

# create db
with app.app_context():
    db.create_all()
    
# routes
@app.route('/api/todos', methods=['GET'])
def get_data():
    data = Todo.query.all()
    return jsonify([todo.to_json() for todo in data])


@app.route('/api/todos', methods=['POST'])
def create_todo():
    data = request.json

    if not data or 'content' not in data:
        return jsonify({"error": "Content required"}), 400 
    # insert
    new_todo = Todo(content=data['content'])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_json()), 201


@app.route('/api/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    # if not exsist, return 404
    todo = Todo.query.get_or_404(id)
    data = request.json
    #get data and update db
    if 'completed' in data:
        todo.completed = data['completed']
    if 'content' in data:
        todo.content = data['content']
    db.session.commit()
    return jsonify(todo.to_json())

@app.route('/api/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Task Deleted!"})

# 5000 maybe occupied by Airplay on MacOS
# python app.py
if __name__ == '__main__':
    app.run(debug=True, port=5001)