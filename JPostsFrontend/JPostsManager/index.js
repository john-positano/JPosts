const {useState} = React
const query = selector => document.querySelector(selector)
const assign = (assignee, assignments) => Object.assign(assignee, assignments)

// CRUD for API
const getJPosts = setJPosts => 
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(setJPosts)

const postJPost = (JPost, setJPosts) =>
  fetch(
    'https://jsonplaceholder.typicode.com/posts',
    {method: 'POST', body: JSON.stringify(JPost), headers: {'Content-Type': 'application/json'}}
  )
    .then(response => response.json())

const putJPost = JPost =>
  fetch(
    `https://jsonplaceholder.typicode.com/posts/${JPost.id}`,
    {method: 'PUT', body: JSON.stringify(JPost), headers: {'Content-Type': 'application/json'}}
  )
    .then(response => response.json())

const deleteJPost = JPost =>
  fetch(
    `https://jsonplaceholder.typicode.com/posts/${JPost.id}`,
    {method: 'DELETE'}    
  )

const afterSave = (setSaving, setSaveButtonText) => {
  setSaving(false)
  setSaveButtonText('Saved!')
  setTimeout(() => setSaveButtonText('Save'), 1000)
}

const beforeSave = (setSaving, setSaveButtonText) => {
  setSaving(true)
  setSaveButtonText('Saving...')  
}

const afterError = (setSaving, setSaveButtonText) => {
  setSaving(false)
  setSaveButtonText('Save')
}

// Validation 
const validateSave = (JPost) => {
  let valid = true
  let validationMessage = ''

  if (JPost.title == '') {
    valid = false
    validationMessage += '\n→ Post must have title.'
  }

  if (JPost.body == '') {
    valid = false
    validationMessage += '\n→ Post must have body.'
  }

  if (!valid) {
    alert(`Post not valid! The following issues must be resolved: ${validationMessage}`)
  }

  return valid
}

// Formalizing CRUD in application
const saveJPost = (JPost, JPosts, setJPosts, setSaveButtonText, setSaving) => {
  if (!validateSave(JPost)) {
    return
  }

  beforeSave(setSaving, setSaveButtonText)

  if (!JPost.id) {
    postJPost(JPost)
      .then(
        response => {
          assign(JPost, {dirty: false, id: response.id})
          setJPosts(assign([], JPosts))
          afterSave(setSaving, setSaveButtonText)      
        }
      )
      .catch(
        _ => {
          alert('There was an issue saving! Please try again later.')
          afterError(setSaving, setSaveButtonText)
        }
      )

    return 
  }

  putJPost(JPost)
    .then(
      response => {
        JPost.dirty = false
        setJPosts(assign([], JPosts))
        afterSave(setSaving, setSaveButtonText)
      }
    )
    .catch(
      _ => {
        alert('There was an issue saving! Please try again later.')
        afterError(setSaving, setSaveButtonText)
      }
    )    
}

const removeJPost = (JPost, JPostIndex, JPosts, setJPosts, setDeleteButtonText, setDeleting) => {
  if (!confirm(`Are you sure you want to delete "${JPost.title}" (Post ID: ${JPost.id})?`)) {
    return
  }

  if (!JPost.id) {
    JPosts.splice(JPostIndex, 1)
    setJPosts(assign([], JPosts))  
    return 
  }

  setDeleting(true)
  setDeleteButtonText('Deleting...')

  deleteJPost(JPost)
    .then(
      response => {
        JPosts.splice(JPostIndex, 1)
        setJPosts(assign([], JPosts))
        setDeleting(false)
      }
    )
    .catch(
      _ => {
        alert('There was an issue deleting! Please try again later.')
        setDeleting(false)
        setDeleteButtonText('Delete')
      }
    )    
}

const addJPost = (JPosts, setJPosts) => {
  JPosts.unshift({userId: 1, title: '', body: '', dirty: 1})
  setJPosts(assign([], JPosts))
}

// Handling changes to each JPost
const setJPostTitle = (JPost, JPosts, setJPosts, {target: {value}}) => {
  assign(JPost, {title: value, dirty: 1})
  setJPosts(assign([], JPosts))
}

const setJPostBody = (JPost, JPosts, setJPosts, {target: {value}}) => {
  assign(JPost, {body: value, dirty: 1})
  setJPosts(assign([], JPosts))
}

// Components
const JPostEditor = ({JPost, JPosts, setJPosts, JPostIndex}) => {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [saveButtonText, setSaveButtonText] = useState('Save')
  const [deleteButtonText, setDeleteButtonText] = useState('Delete')

  return <div class="row"> 
    <div class="card jpost-editor col-lg-6 col-md-9 col-sm-12">
      <label>Author: {JPost.userId}</label>

      <div class="spacer"></div>
      
      <label>Title:</label>
      <input type="text" value={JPost.title} onChange={event => setJPostTitle(JPost, JPosts, setJPosts, event)} />
      
      <div class="spacer"></div>
      
      <label>Body:</label>
      <textarea class="jpost-editor-body" value={JPost.body} onChange={event => setJPostBody(JPost, JPosts, setJPosts, event)} />
      
      <div class="spacer"></div>      
      
      <div class="btn-group col-4">
        <button 
          class="btn btn-success" 
          disabled={!JPost.dirty || saving}
          onClick={_ => saveJPost(JPost, JPosts, setJPosts, setSaveButtonText, setSaving)}
        >
          {saveButtonText}
        </button>
        <button 
          class="btn btn-danger" 
          disabled={deleting}
          onClick={_ => removeJPost(JPost, JPostIndex, JPosts, setJPosts, setDeleteButtonText, setDeleting)}
        >
          {deleteButtonText}
        </button>
      </div>      
    </div>
  </div>
}

const JPostManagerNavbar = ({JPosts, setJPosts, JPostSearch, setJPostSearch}) => {
  return <div class="row">
    <nav class="navbar jposts-manager-navbar card col-lg-6 col-md-9 col-sm-12">
      <div class="container-fluid">
        <span class="navbar-brand">JPosts Manager</span>
        <form class="d-flex">
          <input 
            class="form-control me-2" 
            type="search" 
            placeholder="Search Post Bodies" 
            value={JPostSearch} 
            onChange={event => setJPostSearch(event.target.value)} 
          />
        </form>
        <button class="btn btn-primary" onClick={_ => addJPost(JPosts, setJPosts)}>Create +</button>
      </div>
    </nav>
  </div>
}

const JPostsManager = () => {
  const [JPosts, setJPosts] = useState([])
  const [initialJPostsFetch, setInitialJPostsFetch] = useState(false)
  const [JPostSearch, setJPostSearch] = useState('')

  if (!initialJPostsFetch) {
    getJPosts(setJPosts)
    setInitialJPostsFetch(true)
  }

  return [
    <JPostManagerNavbar JPosts={JPosts} setJPosts={setJPosts} JPostSearch={JPostSearch} setJPostSearch={setJPostSearch} />,
    ...JPosts
      .filter(JPost => JPostSearch ? JPost.body.match(JPostSearch): true)
      .map(
        (JPost, JPostIndex) => 
          <JPostEditor 
            JPost={JPost} 
            JPostIndex={JPostIndex} 
            JPosts={JPosts} 
            setJPosts={setJPosts} 
            key={JPost.id} 
          />
        )
  ]
}

// Render
ReactDOM
  .createRoot(
    query('#jposts-manager-root')
  )
  .render(
    <JPostsManager />
  )