import { createContext, useContext, useState, useEffect } from 'react';
import styles from '../app.module.css';

const TodoContext = createContext({});

export const useTodo = () => {
	return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const requestGetTodo = () => {
		setIsLoading(true);
		fetch(`http://localhost:3005/todos`)
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const requestEditTodo = (id, newTitleTodo) => {
		setIsEditing(true);
		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: newTitleTodo,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Дело изменено, ответ сервера:', response);
				const updateTodos = todos.slice();
				const indexTodo = todos.findIndex((todo) => todo.id === id);
				updateTodos[indexTodo] = response;
				setTodos(updateTodos);
			})
			.finally(() => {
				setIsEditing(false);
			});
		return {
			isEditing,
			requestEditTodo,
		};
	};

	const requestDeleteTodo = (id) => {
		setIsDeleting(true);
		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Дело удалено, ответ сервера:', response);
				setTodos(todos.filter((todo) => todo.id !== id));
			})
			.finally(() => setIsDeleting(false));
		return {
			isDeleting,
			requestDeleteTodo,
		};
	};

	const requestAddTodo = () => {
		setIsCreating(true);
		fetch('http://localhost:3005/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: 'Новое дело',
				completed: 'false',
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Добавлено новое дело, ответ сервера:', response);
				setTodos([...todos, response]);
			})
			.finally(() => {
				setIsCreating(false);
			});
		return {
			isCreating,
			requestAddTodo,
		};
	};

	const requestCompletedTodo = (id) => {
		setIsCompleted(true);
		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				completed: 'true',
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Дело сделано, ответ сервера:', response);
				const updateTodos = todos.slice();
				const indexTodo = todos.findIndex((todo) => todo.id === id);
				updateTodos[indexTodo] = response;
				setTodos(updateTodos);
			})
			.finally(() => setIsCompleted(false));
		return {
			isCompleted,
			requestCompletedTodo,
		};
	};

	useEffect(() => {
		requestGetTodo();
	}, []);

	return (
		<TodoContext.Provider
			value={{
				todos,
				setTodos,
				requestGetTodo,
				requestEditTodo,
				requestDeleteTodo,
				requestAddTodo,
				requestCompletedTodo,
			}}
		>
			{isLoading ? <div className={styles.loader}></div> : children}
		</TodoContext.Provider>
	);
};
