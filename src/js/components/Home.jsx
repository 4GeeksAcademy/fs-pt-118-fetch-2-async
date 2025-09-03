import React, { useEffect, useState } from "react";

//create your first component
const Home = () => {
	const url = 'https://playground.4geeks.com/todo'

	//fetch por prmesas
	//fetch(URL, {}).then().then().catch()

	//fetch async

	// const fetchUser = async () => {
	// 	try {

	// 		const resp = await fetch();
	// 		if (!resp.ok) throw new Error('error fetching user')
	// 		const data = await resp.json();
	// 		//manejamos data
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }

	const username = 'pepe'
	const [todos, setTodos] = useState([]); // estado para manejar la lista de tareas
	const [newTask, setNewTask] = useState(''); // estado para manejar el input
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('')


	useEffect(() => {
		fetchTodos();
	}, [])


	useEffect(() => {
		setTimeout(() => {
			setError('')
		}, 3000)
	}, [error])

	const fetchTodos = async () => {
		try {
			setLoading(true)
			const resp = await fetch(url + '/users/' + username)
			if (!resp.ok) throw new Error(resp.status)
			const data = await resp.json()
			setTodos(data.todos)
			setLoading(false)
		} catch (error) {
			console.log(error)
			createUser()
		}
	}

	const createUser = async () => {
		try {
			const resp = await fetch(url + '/users/' + username, {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})
			if (!resp.ok) throw new Error('error creating user ' + resp.status)
			return fetchTodos()
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const createTodo = async () => {
		if (newTask.trim().length === 0 || newTask.trim().length < 4) {
			return setError('task cannot be empty or less than 3 chars')
		}
		const newTodo = {
			label: newTask, is_done: false
		}
		try {
			setLoading(true)
			const resp = await fetch(url + '/todos/' + username, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newTodo)
			})
			if (!resp.ok) throw new Error('Error creating new task')
			const data = await resp.json()
			console.log(data)
			//ejemplo pidiendo a la api una nueva lista despues de actualizar
			//return fetchTodos()
			setTodos([...todos, data])
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}


	const handleSubmit = e => {
		e.preventDefault();
		createTodo();
		setNewTask('');
	}

	const handleChange = e => {
		setError('')
		setNewTask(e.target.value)
	}


	const handleDelete = async (id) => {
		console.log(id)
		try {
			setLoading(true)
			const resp = await fetch(url + '/todos/' + id, {
				method: 'DELETE'
			})
			if (!resp.ok) throw new Error('error deleting todo')
			let aux = [...todos]
			aux = aux.filter(el => el.id != id)
			setTodos(aux)
			setLoading(false)
		} catch (error) {
			setLoading(false)
		}
	}

	const handleComplete = async (label, id) => {
		const updated = {
			label,
			is_done: true
		}
		try {
			setLoading(true)
			const resp = await fetch(url + '/todos/' + id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updated)
			})
			if (!resp.ok) throw new Error('error completing task')
			const data = await resp.json()



			//actualizamos el elemento que marcamos como completado sin necesidad de realizar una llamda a la API
			const aux = [...todos] //copiamos estado
			const index = aux.findIndex(el => el.id == id) // buscamos elemento a actualizar
			aux[index] = data // ponemos en la posicion del elemento a actualizar la respuesta de la API
			setTodos(aux) // actualizamos nuestro estado con el elemento actualizado

			setLoading(false)
		} catch (error) {
			console.log(error)
		}
	}


	return (
		<div className="text-center">
			{error && <div className="bg-danger">{error}</div>}
			<form className="form-control"
				onSubmit={handleSubmit}
			>
				<div className="input-group mb-3 w-50 mx-auto">
					<input
						type="text"
						className="form-control"
						placeholder="What needs to be done?"
						aria-label="new to-do"
						aria-describedby="submit"
						value={newTask}
						onChange={handleChange}
					/>
					<button
						className="btn btn-outline-secondary"
						type="submit"
						id="submit"
					>
						{loading ?
							<span className="spinner-border" role="status"></span>
							:
							'add'}

					</button>
				</div>
			</form>
			<ul>
				{todos?.map(el => <li
					key={el.id}
					className={el.is_done ? 'bg-success' : 'bg-info-subtle'}
				>
					{el.label}
					<span className="fa-solid fa-check mx-3" onClick={() => handleComplete(el.label, el.id)}></span>
					<span className="fa-solid fa-trash" onClick={() => handleDelete(el.id)}></span>
				</li>)}
			</ul>


		</div>
	);
};

export default Home;