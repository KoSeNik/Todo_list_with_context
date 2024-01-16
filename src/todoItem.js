import { useState } from 'react';
import styles from './app.module.css';
import { TodoProvider, useTodo } from './hooks/use-todo';

export const TodoItem = (todo) => {
	const [isEditItem, setIsEditItem] = useState(false);
	const [newTitleTodo, setNewTitleTodo] = useState(todo.title);

	const {
		requestEditTodo,
		isDeleting,
		requestDeleteTodo,
		isCompleted,
		requestCompletedTodo,
	} = useTodo(newTitleTodo);

	const handleEditItem = () => {
		setIsEditItem((prevState) => !prevState);
	};

	return (
		<TodoProvider>
			<>
				{!isEditItem ? (
					<div className={styles.todo}>
						<div>
							{todo.title} -{' '}
							{todo.completed === 'true' ? 'выполнено' : 'не выполнено'}
						</div>
						<button
							className={styles.button}
							onClick={() => {
								handleEditItem();
							}}
						>
							Изменить дело
						</button>
						<button
							className={styles.button}
							disabled={isCompleted}
							onClick={() => {
								requestCompletedTodo(todo.id);
							}}
						>
							Выполнить дело
						</button>
						<button
							className={styles.button}
							disabled={isDeleting}
							onClick={() => requestDeleteTodo(todo.id)}
						>
							Удалить дело
						</button>
					</div>
				) : (
					<div className={styles.todo}>
						<input
							value={newTitleTodo}
							onChange={(e) => {
								setNewTitleTodo(e.currentTarget.value);
							}}
						/>
						<button
							className={styles.button}
							onClick={() => {
								requestEditTodo(todo.id);
							}}
						>
							Сохранить изменения
						</button>
						<button
							className={styles.button}
							onClick={() => {
								handleEditItem();
							}}
						>
							Отменить изменения
						</button>
					</div>
				)}
			</>
		</TodoProvider>
	);
};
