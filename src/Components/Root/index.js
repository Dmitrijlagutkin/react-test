import React, { useState, useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'

import {
  Column,
  Container,
  Post,
  PostAuthor,
  PostBody,
  ActiveButton,
  Pagination,
} from './styles'

import ExpensiveTree from '../ExpensiveTree'

function Root() {
  const [count, setCount] = useState(0)
  const [fields, setFields] = useState([
    {
      name: faker.name.findName(),
      id: nanoid(),
    },
  ])

  const [value, setValue] = useState('')
  const [totalAmount, setTotalAmount] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const { data, loading } = useQuery(postsQuery, { variables: { page, limit } })
  const [result, setResult] = useState([])

  useEffect(() => {
    setTotalAmount(data?.posts?.meta?.totalCount)
  }, [data])

  useEffect(() => {
    setTotalPages(calculateTotalPages(+totalAmount, +limit))
  }, [totalAmount])

  const pagesArrey = n => Array.from({ length: n }, (v, k) => k + 1)

  useEffect(() => {
    setResult(pagesArrey(totalPages))
  }, [totalPages])

  function calculateTotalPages() {
    return Math.ceil(+totalAmount / +limit)
  }

  function handlePrev() {
    if (page !== 1) setPage(page - 1)
  }
  function handleNext() {
    if (page !== totalPages) setPage(page + 1)
  }

  function handlePush() {
    setFields([{ name: faker.name.findName(), id: nanoid() }, ...fields])
  }

  function handleAlertClick() {
    setTimeout(() => {
      alert(`You clicked ${count} times`)
    }, 2500)
  }

  const handleChangePage = targetPage => {
    setPage(targetPage)
  }

  const posts = data?.posts.data || []

  return (
    <Container>
      <Column>
        <h4>Need to add pagination</h4>
        {loading
          ? 'Loading...'
          : posts.map(post => (
              <Post mx={4} key={post.id} id={post.Id}>
                <NavLink href={POST(post.id)} to={POST(post.id)}>
                  {post.title}
                </NavLink>
                <PostAuthor>by {post.user.name}</PostAuthor>
                <PostBody>{post.body}</PostBody>
              </Post>
            ))}
        {!loading && (
          <div>
            <Pagination type="button" onClick={handlePrev}>
              {'<'}
            </Pagination>

            {result.length &&
              result.map(pages =>
                pages !== page ? (
                  <Pagination
                    key={pages}
                    type="button"
                    onClick={() => handleChangePage(pages)}
                  >
                    {pages}
                  </Pagination>
                ) : (
                  <ActiveButton my={4} key={pages}>
                    {pages}
                  </ActiveButton>
                ),
              )}

            <button type="button" onClick={handleNext}>
              {'>'}
            </button>
          </div>
        )}
      </Column>
      <Column>
        <h4>Slow rendering</h4>
        <label>
          Enter something here:
          <br />
          <input
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </label>
        <p>So slow...</p>
        <ExpensiveTree />

        <h4>Closures</h4>
        <p>You clicked {count} times</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <button type="button" onClick={handleAlertClick}>
          Show alert
        </button>
      </Column>

      <Column>
        <h4>Incorrect form field behavior</h4>
        <button type="button" onClick={handlePush}>
          Add more
        </button>
        <ol>
          {fields.map((field, index) => (
            <li key={index}>
              {field.name}:<br />
              <input type="text" />
            </li>
          ))}
        </ol>
      </Column>
    </Container>
  )
}

export default Root
