import styles from './app.module.css';
import { useState } from 'react';
import { TodoItem } from './todoItem';
import { useTodo } from './hooks/use-todo';

export const App = () => {
	const [searchTodo, setSearchTodo] = useState('');
	const [sortTodoFlag, setSortTodoFlag] = useState(false);

	const {
		todos,
		setTodos,
		isLoading,
		isCreating,
		requestAddTodo
	} = useTodo();

	const handleSearch = (e) => {
		setSearchTodo(e.target.value);
	};

	const filterTodos = todos.filter((todo) => todo.title.includes(searchTodo));

	const sortTodo = () => {
		const copyData = filterTodos.slice();
		const sortData = copyData.sort((a, b) => a.title.localeCompare(b.title));
		setTodos(sortData);
		setSortTodoFlag(true);
	};

	const addTodo = () => {
		setSortTodoFlag(false);
		requestAddTodo();
	};

	return (
		<div className={styles.app}>
			<div>Список дел</div>
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				filterTodos.map((todo) => <TodoItem key={todo.id} {...todo} />)
			)}
			<button
				disabled={isCreating}
				onClick={addTodo}
				className={styles.button}
			>
				Добавить дело
			</button>
			<input value={searchTodo} onChange={handleSearch} placeholder="Поиск дела" />
			<button
				onClick={sortTodo}
				className={`${styles.button} ${sortTodoFlag ? styles.buttonPressed : ''}`}
			>
				Сортировка дел по алфавиту
			</button>
		</div>
	);
};
