import { NextResponse } from 'next/server'

// API 라우트를 동적으로 렌더링하도록 설정
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const bearerToken = process.env.X_BEARER_TOKEN
    const apiKey = process.env.X_API_KEY
    const apiSecret = process.env.X_API_SECRET

    if (!bearerToken && (!apiKey || !apiSecret)) {
      return NextResponse.json({
        success: false,
        error: 'X_BEARER_TOKEN 또는 (X_API_KEY, X_API_SECRET) 환경 변수가 설정되지 않았습니다.',
        platform: 'X (Twitter)',
        requiredEnvVars: ['X_BEARER_TOKEN 또는 (X_API_KEY, X_API_SECRET)'],
      })
    }

    // X API v2 - 사용자 정보 가져오기 (Bearer Token 사용)
    const token = bearerToken || 'Bearer token required'
    
    // Bearer Token이 있는 경우 사용자 정보 가져오기
    if (bearerToken) {
      const response = await fetch(
        'https://api.twitter.com/2/users/me?user.fields=id,name,username,description',
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.text()
        return NextResponse.json({
          success: false,
          error: `X API 오류: ${response.status} ${response.statusText}`,
          details: errorData,
          platform: 'X (Twitter)',
        })
      }

      const data = await response.json()

      return NextResponse.json({
        success: true,
        data: {
          user: data,
          message: 'X API 연결 성공',
        },
        platform: 'X (Twitter)',
      })
    } else {
      // API Key와 Secret만 있는 경우 (OAuth 2.0 필요)
      return NextResponse.json({
        success: false,
        error: 'Bearer Token이 필요합니다. OAuth 2.0 인증을 완료하거나 Bearer Token을 설정하세요.',
        platform: 'X (Twitter)',
        note: 'X API는 Bearer Token 또는 OAuth 2.0 인증이 필요합니다.',
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.',
      platform: 'X (Twitter)',
    })
  }
}

