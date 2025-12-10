import { NextResponse } from 'next/server'

// API 라우트를 동적으로 렌더링하도록 설정
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'LINKEDIN_ACCESS_TOKEN 환경 변수가 설정되지 않았습니다.',
        platform: 'LinkedIn',
        requiredEnvVars: ['LINKEDIN_ACCESS_TOKEN'],
      })
    }

    // LinkedIn API - 사용자 프로필 정보 가져오기
    const response = await fetch(
      'https://api.linkedin.com/v2/userinfo',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({
        success: false,
        error: `LinkedIn API 오류: ${response.status} ${response.statusText}`,
        details: errorData,
        platform: 'LinkedIn',
      })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        user: data,
        message: 'LinkedIn API 연결 성공',
      },
      platform: 'LinkedIn',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.',
      platform: 'LinkedIn',
    })
  }
}

