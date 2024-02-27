import {useState} from 'react'

import SpotifyAuthorization from './SpotifyAuthorization'

const App = () => {

  const [hasToken, setHasToken] = useState(false);

  return (
    <div>
      <h1>Spotify App</h1>
      <SpotifyAuthorization hasToken={hasToken} setHasToken={setHasToken}/>
    </div>
  )
}

export default App
