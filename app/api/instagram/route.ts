import { NextResponse } from 'next/server'

// API 라우트를 동적으로 렌더링하도록 설정
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const userId = process.env.INSTAGRAM_USER_ID
    const { searchParams } = new URL(request.url)
    const includePosts = searchParams.get('posts') === 'true'
    const hashtag = searchParams.get('hashtag') // 해시태그 필터 (예: #travel)
    const keyword = searchParams.get('keyword') // 키워드 필터 (캡션에 포함된 텍스트)
    const mediaType = searchParams.get('mediaType') // 미디어 타입 필터: IMAGE, VIDEO, CAROUSEL_ALBUM
    const postId = searchParams.get('postId') // 특정 게시물 ID
    const sortBy = searchParams.get('sortBy') // 정렬 기준: recent, comments, likes, views

    if (!accessToken || !userId) {
      return NextResponse.json({
        success: false,
        error: 'INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID environment variables are not set.',
        platform: 'Instagram',
        requiredEnvVars: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_USER_ID'],
      })
    }

    // Instagram Graph API - 사용자 정보 가져오기
    const userFields = [
      'id',
      'username',
      'account_type',
      'media_count'
    ].join(',')
    
    const userResponse = await fetch(
      `https://graph.instagram.com/${userId}?fields=${userFields}&access_token=${accessToken}`
    )

    if (!userResponse.ok) {
      const errorData = await userResponse.text()
      return NextResponse.json({
        success: false,
        error: `Instagram API Error: ${userResponse.status} ${userResponse.statusText}`,
        details: errorData,
        platform: 'Instagram',
      })
    }

    const userData = await userResponse.json()

    const result: any = {
      user: userData,
      message: 'Instagram API connection successful',
    }

    // 포스트 가져오기 요청이 있는 경우
    if (includePosts || postId) {
      try {
        let posts: any[] = []
        
        // 특정 게시물 ID가 있는 경우
        if (postId) {
          const postFields = [
            'id',
            'caption',
            'media_type',
            'media_url',
            'permalink',
            'thumbnail_url',
            'timestamp',
            'like_count',
            'comments_count',
            'is_comment_enabled',
            'shortcode',
            'children{id,media_type,media_url,thumbnail_url}',
            'location'
          ].join(',')
          
          const postResponse = await fetch(
            `https://graph.instagram.com/${postId}?fields=${postFields}&access_token=${accessToken}`
          )
          
          if (postResponse.ok) {
            const postData = await postResponse.json()
            posts = [postData]
            
            // Insights 정보 가져오기 (Insights API 사용)
            try {
              const insightsMetrics = [
                'impressions',
                'reach',
                'engagement',
                'saved',
                'video_views',
                'video_view_time'
              ].join(',')
              
              const insightsResponse = await fetch(
                `https://graph.instagram.com/${postId}/insights?metric=${insightsMetrics}&access_token=${accessToken}`
              )
              if (insightsResponse.ok) {
                const insightsData = await insightsResponse.json()
                if (insightsData.data) {
                  insightsData.data.forEach((item: any) => {
                    const metricName = item.name
                    const value = item.values?.[0]?.value || 0
                    if (metricName === 'impressions') {
                      posts[0].views_count = value
                      posts[0].impressions = value
                    } else if (metricName === 'reach') {
                      posts[0].reach = value
                    } else if (metricName === 'engagement') {
                      posts[0].engagement = value
                    } else if (metricName === 'saved') {
                      posts[0].saved = value
                    } else if (metricName === 'video_views') {
                      posts[0].video_views = value
                    } else if (metricName === 'video_view_time') {
                      posts[0].video_view_time = value
                    }
                  })
                }
              }
            } catch (e) {
              // Insights API 실패 시 무시
            }
          } else {
            const errorData = await postResponse.text()
            result.postsError = `Failed to fetch post: ${postResponse.status} ${postResponse.statusText}`
            result.postsErrorDetails = errorData
          }
        } else {
          // 모든 미디어 가져오기 (필터링을 위해 더 많이 가져옴)
          // 조회수(views_count)는 Instagram Insights API가 필요하며, Business Account와 추가 권한이 필요합니다
          const limit = 50 // 필터링을 위해 더 많은 포스트 가져오기
          const mediaFields = [
            'id',
            'caption',
            'media_type',
            'media_url',
            'permalink',
            'thumbnail_url',
            'timestamp',
            'like_count',
            'comments_count',
            'is_comment_enabled',
            'shortcode',
            'children{id,media_type,media_url,thumbnail_url}',
            'location'
          ].join(',')
          
          const mediaResponse = await fetch(
            `https://graph.instagram.com/${userId}/media?fields=${mediaFields}&access_token=${accessToken}&limit=${limit}`
          )

          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json()
            posts = mediaData.data || []
            
            // Insights 정보 가져오기 (Insights API 사용)
            // Instagram Business Account와 insights 권한이 필요합니다
            if (posts.length > 0) {
              // 각 포스트의 Insights 정보 가져오기
              for (let i = 0; i < Math.min(posts.length, 50); i++) {
                try {
                  const insightsMetrics = [
                    'impressions',
                    'reach',
                    'engagement',
                    'saved',
                    'video_views',
                    'video_view_time'
                  ].join(',')
                  
                  const insightsResponse = await fetch(
                    `https://graph.instagram.com/${posts[i].id}/insights?metric=${insightsMetrics}&access_token=${accessToken}`
                  )
                  if (insightsResponse.ok) {
                    const insightsData = await insightsResponse.json()
                    if (insightsData.data) {
                      insightsData.data.forEach((item: any) => {
                        const metricName = item.name
                        const value = item.values?.[0]?.value || 0
                        if (metricName === 'impressions') {
                          posts[i].views_count = value
                          posts[i].impressions = value
                        } else if (metricName === 'reach') {
                          posts[i].reach = value
                        } else if (metricName === 'engagement') {
                          posts[i].engagement = value
                        } else if (metricName === 'saved') {
                          posts[i].saved = value
                        } else if (metricName === 'video_views') {
                          posts[i].video_views = value
                        } else if (metricName === 'video_view_time') {
                          posts[i].video_view_time = value
                        }
                      })
                    }
                  }
                  // API 제한을 피하기 위해 약간의 지연
                  await new Promise(resolve => setTimeout(resolve, 100))
                } catch (e) {
                  // Insights API 실패 시 무시하고 계속 진행
                  // Insights 필드가 없으면 undefined로 유지
                }
              }
            }
            
            // 다음 페이지가 있으면 계속 가져오기 (필터링을 위해)
            let nextPage = mediaData.paging?.next
            while (nextPage && posts.length < 100) {
              try {
                const nextResponse = await fetch(nextPage)
                if (nextResponse.ok) {
                  const nextData = await nextResponse.json()
                  posts = [...posts, ...(nextData.data || [])]
                  nextPage = nextData.paging?.next
                } else {
                  break
                }
              } catch (e) {
                break
              }
            }
          } else {
            const errorData = await mediaResponse.text()
            result.postsError = `Failed to fetch posts: ${mediaResponse.status} ${mediaResponse.statusText}`
            result.postsErrorDetails = errorData
          }
        }

        // 필터링 적용
        if (posts.length > 0) {
          let filteredPosts = posts

          // 해시태그 필터
          if (hashtag) {
            const tag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`
            filteredPosts = filteredPosts.filter((post: any) => {
              const caption = post.caption || ''
              return caption.toLowerCase().includes(tag.toLowerCase())
            })
          }

          // 키워드 필터
          if (keyword) {
            filteredPosts = filteredPosts.filter((post: any) => {
              const caption = post.caption || ''
              return caption.toLowerCase().includes(keyword.toLowerCase())
            })
          }

          // 미디어 타입 필터
          if (mediaType) {
            filteredPosts = filteredPosts.filter((post: any) => {
              return post.media_type === mediaType.toUpperCase()
            })
          }

          // 정렬 적용
          if (sortBy) {
            switch (sortBy) {
              case 'recent':
                // 최근 등록 순 (timestamp 내림차순)
                filteredPosts.sort((a: any, b: any) => {
                  const timeA = new Date(a.timestamp).getTime()
                  const timeB = new Date(b.timestamp).getTime()
                  return timeB - timeA
                })
                break
              case 'comments':
                // 댓글 많은 순 (comments_count 내림차순)
                filteredPosts.sort((a: any, b: any) => {
                  const commentsA = a.comments_count || 0
                  const commentsB = b.comments_count || 0
                  return commentsB - commentsA
                })
                break
              case 'likes':
                // 좋아요 많은 순 (like_count 내림차순)
                filteredPosts.sort((a: any, b: any) => {
                  const likesA = a.like_count || 0
                  const likesB = b.like_count || 0
                  return likesB - likesA
                })
                break
              case 'views':
                // 조회수 많은 순 (views_count 내림차순) - Insights API 필요
                // 일단 좋아요 수로 대체하거나, views_count가 있으면 사용
                filteredPosts.sort((a: any, b: any) => {
                  const viewsA = a.views_count || a.like_count || 0
                  const viewsB = b.views_count || b.like_count || 0
                  return viewsB - viewsA
                })
                break
            }
          } else {
            // 기본값: 최근 등록 순
            filteredPosts.sort((a: any, b: any) => {
              const timeA = new Date(a.timestamp).getTime()
              const timeB = new Date(b.timestamp).getTime()
              return timeB - timeA
            })
          }

          result.posts = filteredPosts
          result.postsCount = filteredPosts.length
          result.totalPostsBeforeFilter = posts.length
          result.filters = {
            hashtag: hashtag || null,
            keyword: keyword || null,
            mediaType: mediaType || null,
            postId: postId || null,
            sortBy: sortBy || 'recent',
          }
        } else {
          result.posts = []
          result.postsCount = 0
        }
      } catch (postsError: any) {
        result.postsError = postsError.message || 'An error occurred while fetching posts.'
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      platform: 'Instagram',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred.',
      platform: 'Instagram',
    })
  }
}

