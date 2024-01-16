import { useState } from 'react';
import styles from './app.module.css';
import { TodoItem } from './todoItem';
import { useDebounce } from '@uidotdev/usehooks';
import { TodoProvider, useTodo } from './hooks/use-todo';

export const App = () => {
	//const [refreshTodoFlag, setRefreshTodoFlag] = useState(false);
	const [searchTodo, setSearchTodo] = useState('');
	const debouncedSearchTodo = useDebounce(searchTodo, 1000);

	const [sortTodoFlag, setSortTodoFlag] = useState(false);

	//const refreshTodo = () => setRefreshTodoFlag(!refreshTodoFlag);

	const { todos, setTodos, isLoading, isCreating, requestAddTodo } = useTodo(
		//	refreshTodoFlag,
		debouncedSearchTodo,
		setSortTodoFlag,
		//	refreshTodo,
	);

	console.log(todos);

	const handleSearch = (e) => {
		setSearchTodo(e.target.value);
	};

	const sortTodo = () => {
		const copyData = todos.slice();
		const sortData = copyData.sort((a, b) => a.title.localeCompare(b.title));
		setTodos(sortData);
		setSortTodoFlag(true);
	};

	return (
		<TodoProvider>
			<div className={styles.app}>
				<div>Список дел</div>
				{isLoading ? (
					<div className={styles.loader}></div>
				) : (
					todos?.map((todo) => (
						//						<TodoItem key={todo.id} {...todo} refreshTodo={refreshTodo} />
						<TodoItem key={todo.id} {...todo} />
					))
				)}
				<button
					disabled={isCreating}
					onClick={requestAddTodo}
					className={styles.button}
				>
					Добавить дело
				</button>
				<input
					value={searchTodo}
					onChange={handleSearch}
					placeholder="Поиск дела"
				/>
				<button
					onClick={sortTodo}
					className={`${styles.button} ${
						sortTodoFlag ? styles.buttonPressed : ''
					}`}
				>
					Сортировка дел по алфавиту
				</button>
			</div>
		</TodoProvider>
	);
};
