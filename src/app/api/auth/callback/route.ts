import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log('[OAuth Callback] Starting authentication flow');
  console.log('[OAuth Callback] Has code:', !!code);
  console.log('[OAuth Callback] Has error:', error);

  // Handle OAuth error
  if (error) {
    console.error('[OAuth Callback] GitHub returned error:', error);
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
  }

  if (!code) {
    console.error('[OAuth Callback] No authorization code received');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    console.log('[OAuth Callback] Client ID present:', !!clientId);
    console.log('[OAuth Callback] Client Secret present:', !!clientSecret);

    if (!clientId || !clientSecret) {
      console.error('[OAuth Callback] Missing environment variables');
      return NextResponse.redirect(new URL('/?error=missing_env_vars', request.url));
    }

    // Exchange code for access token
    console.log('[OAuth Callback] Exchanging code for token...');
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('[OAuth Callback] Token exchange response:', tokenData.error ? 'ERROR' : 'SUCCESS');

    if (tokenData.error) {
      console.error('[OAuth Callback] GitHub OAuth error:', tokenData);
      return NextResponse.redirect(new URL(`/?error=${tokenData.error}`, request.url));
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[OAuth Callback] No access token received');
      return NextResponse.redirect(new URL('/?error=no_token', request.url));
    }

    // Get user information
    console.log('[OAuth Callback] Fetching user data...');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      console.error('[OAuth Callback] Failed to fetch user data:', userResponse.status);
      return NextResponse.redirect(new URL('/?error=user_fetch_failed', request.url));
    }

    const userData = await userResponse.json();
    console.log('[OAuth Callback] User data received for:', userData.login);

    // Redirect to a success page with token and user data in URL params (will be handled client-side)
    // In production, you might want to use a more secure method like HTTP-only cookies
    const redirectUrl = new URL('/auth/success', request.url);
    redirectUrl.searchParams.set('token', accessToken);
    redirectUrl.searchParams.set('user', JSON.stringify(userData));

    console.log('[OAuth Callback] Redirecting to success page');
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('[OAuth Callback] Unexpected error:', error);
    return NextResponse.redirect(new URL('/?error=callback_failed', request.url));
  }
}