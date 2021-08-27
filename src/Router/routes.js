export const ROOT = '/'

export const POST = (postId, page) =>
  `${ROOT}posts/${postId || ':postId'}/${page || ':page'}`
