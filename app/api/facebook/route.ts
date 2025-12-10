import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
    const appId = process.env.FACEBOOK_APP_ID
    const appSecret = process.env.FACEBOOK_APP_SECRET

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'FACEBOOK_ACCESS_TOKEN 환경 변수가 설정되지 않았습니다.',
        platform: 'Facebook',
        requiredEnvVars: ['FACEBOOK_ACCESS_TOKEN'],
      })
    }

    // Facebook Graph API - 사용자 정보 가져오기
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    )

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({
        success: false,
        error: `Facebook API 오류: ${response.status} ${response.statusText}`,
        details: errorData,
        platform: 'Facebook',
      })
    }

    const data = await response.json()

    // 앱 정보도 함께 가져오기 (선택사항)
    let appInfo = null
    if (appId && appSecret) {
      try {
        const appResponse = await fetch(
          `https://graph.facebook.com/${appId}?access_token=${accessToken}`
        )
        if (appResponse.ok) {
          appInfo = await appResponse.json()
        }
      } catch (e) {
        // 앱 정보는 선택사항이므로 실패해도 무시
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data,
        app: appInfo,
        message: 'Facebook API 연결 성공',
      },
      platform: 'Facebook',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.',
      platform: 'Facebook',
    })
  }
}

