import {useState} from 'react'

// Authorization code
const clientId = '6fc5eda025b8463ea9bd776424fec51d'
const redirectUri = 'http://localhost:3001';

const generateRandomString = (length) => {
    const possible = 'QwMLGUV0hZGO7vGM3vqzb25IQTbfH6gbKQxMhMFze0k';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
  const codeVerifier = generateRandomString(64);
  
  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }
  
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  
  async function redirectToSpotifyAuthorize() {  
    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize")
  
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
  
    window.sessionStorage.setItem('code_verifier', codeVerifier);
  
    const params =  {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }
    
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  }

const SpotifyAuthorization = () => {

  const [hasToken, setHasToken] = useState(false);

    async function getToken(code) {
      let codeVerifier = sessionStorage.getItem('code_verifier');

      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      }
    
      const tokenEndpoint = "https://accounts.spotify.com/api/token";

      const body = await fetch(tokenEndpoint, payload);
      const response = await body.json();
    
      sessionStorage.setItem('access_token', response.access_token);
      setHasToken(true);
      console.log("token:", sessionStorage.getItem('access_token'));
    }

    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    
    // If user does not accept request or error occurs
    let error = urlParams.get('error');
    let state = urlParams.get('state');

    if (code && !hasToken) {
        getToken(code);
    }
    // Error Handling
    let message = "";
    if (!hasToken) {
        message = "Login to spotify to use the app";
    } else {
        message = "Logged in";
    }

    return (
        <div>
            <p>{message}</p>
            <button onClick={redirectToSpotifyAuthorize}>Spotify Login</button>
        </div>
    )
}

export default SpotifyAuthorization
