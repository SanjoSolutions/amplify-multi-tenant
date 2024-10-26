'use client'

import { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import './../app/app.css'
import { Amplify } from 'aws-amplify'
import outputs from '@/amplify_outputs.json'
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'
import { fetchAuthSession } from 'aws-amplify/auth'

Amplify.configure(outputs, {
  API: {
    GraphQL: {
      async headers() {
        const session = await fetchAuthSession()
        return {
          Authorization: session.tokens?.idToken?.toString()!,
        }
      },
    },
    REST: {
      async headers() {
        const session = await fetchAuthSession()
        return {
          Authorization: session.tokens?.idToken?.toString()!,
        }
      },
    },
  },
})

const client = generateClient<Schema>()

export default function App() {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([])

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: data => {
        debugger
        setTodos([...data.items])
      },
    })
  }

  useEffect(() => {
    listTodos()
  }, [])

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt('Todo content'),
    })
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map(todo => (
              <li key={todo.id}>{todo.content}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href='https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/'>
              Review next steps of this tutorial.
            </a>
          </div>
        </main>
      )}
    </Authenticator>
  )
}
