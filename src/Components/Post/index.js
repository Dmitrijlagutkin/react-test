import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import { useQuery } from '@apollo/client'
import arrayMove from 'array-move'

import postQuery from 'GraphQL/Queries/post.graphql'
import postsQuery from 'GraphQL/Queries/posts.graphql'

import { ROOT } from 'Router/routes'

import {
  Back,
  Column,
  Container,
  PostAuthor,
  PostBody,
  PostComment,
  PostContainer,
} from './styles'

const SortableContainer = sortableContainer(({ children }) => (
  <div>{children}</div>
))

const SortableItem = sortableElement(({ value }) => (
  <PostComment mb={2}>{value}</PostComment>
))

function Post() {
  const [comments, setComments] = useState([])
  const [limit, setLimit] = useState(10)

  const history = useHistory()
  const {
    params: { postId },
  } = useRouteMatch()

  const {
    params: { page },
  } = useRouteMatch()

  console.log(postId)

  const posts = useQuery(postsQuery, {
    variables: { page: +page, limit },
  })

  const [currentPosts, setCurrentPosts] = useState(posts?.data?.posts?.data)
  const [currentIndex, setCurrentIndex] = useState(
    currentPosts.findIndex(el => el.id == postId),
  )
  const [currentPostId, setCurrentPostId] = useState(postId)

  useEffect(() => {
    setCurrentPostId(currentPosts[currentIndex].id)
  }, [currentIndex])

  // console.log('currentPosts', currentPosts)
  // console.log('currentIndex', currentIndex)
  // console.log('currentPost id', currentPostId)

  const handlePrev = () => {
    if (currentIndex != 0) setCurrentIndex(currentIndex - 1)
  }
  const handleNext = () => {
    if (currentIndex != limit - 1) setCurrentIndex(currentIndex + 1)
  }

  const handleClick = () => history.push(ROOT)

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setComments(arrayMove(comments, newIndex, oldIndex))
  }

  const { data, loading } = useQuery(postQuery, {
    variables: { id: currentPostId || postId },
  })

  const post = data?.post || {}

  useEffect(() => {
    setComments(post.comments?.data || [])
  }, [post])

  return (
    <Container>
      <Column>
        <Back onClick={handleClick}>Back</Back>
      </Column>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <Column>
            <h4>Need to add next/previous links</h4>
            <div>
              <button type="button" onClick={handlePrev}>
                prev
              </button>
              <button type="button" onClick={handleNext}>
                next
              </button>
            </div>
            <PostContainer key={post.id}>
              <h3>{post.title}</h3>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody mt={2}>{post.body}</PostBody>
            </PostContainer>
            <div>Next/prev here</div>
          </Column>

          <Column>
            <h4>Incorrect sorting</h4>
            Comments:
            <SortableContainer onSortEnd={handleSortEnd}>
              {comments.map((comment, index) => (
                <SortableItem
                  index={index}
                  key={comment.id}
                  mb={3}
                  value={comment.body}
                />
              ))}
            </SortableContainer>
          </Column>
        </>
      )}
    </Container>
  )
}

export default Post
