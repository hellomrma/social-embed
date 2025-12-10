'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

export default function Home() {
  const router = useRouter()
  const [results, setResults] = useState<Record<string, ApiResponse>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [loadingPostDetails, setLoadingPostDetails] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({
    instagram: {
      hashtag: '',
      keyword: '',
      mediaType: '',
      postId: '',
      sortBy: 'recent', // recent, comments, likes, views
    }
  })

  const testApi = async (
    platform: string, 
    includePosts: boolean = false,
    filterParams?: { hashtag?: string; keyword?: string; mediaType?: string; postId?: string; sortBy?: string }
  ) => {
    setLoading(prev => ({ ...prev, [platform]: true }))
    setResults(prev => ({ ...prev, [platform]: { success: false, error: 'Testing...' } }))

    try {
      const params = new URLSearchParams()
      if (includePosts) {
        params.append('posts', 'true')
      }
      if (filterParams?.hashtag) {
        params.append('hashtag', filterParams.hashtag)
      }
      if (filterParams?.keyword) {
        params.append('keyword', filterParams.keyword)
      }
      if (filterParams?.mediaType) {
        params.append('mediaType', filterParams.mediaType)
      }
      if (filterParams?.postId) {
        params.append('postId', filterParams.postId)
      }
      if (filterParams?.sortBy) {
        params.append('sortBy', filterParams.sortBy)
      }

      const url = `/api/${platform}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      setResults(prev => ({ ...prev, [platform]: data }))
      
      // 로그를 localStorage에 저장
      try {
        const existingLogs = localStorage.getItem('instagram_api_logs')
        const logs = existingLogs ? JSON.parse(existingLogs) : {}
        logs[platform] = data
        localStorage.setItem('instagram_api_logs', JSON.stringify(logs))
      } catch (e) {
        console.error('Failed to save logs:', e)
      }
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [platform]: { success: false, error: error.message || 'Unknown error' }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }))
    }
  }

  const handleFilterChange = (platform: string, field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      }
    }))
  }

  const platforms = [
    { name: 'instagram', label: 'Instagram', color: '#000000' },
  ]

  return (
    <main className={styles.main}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Social Media API Test</h1>
        <button
          onClick={() => setShowModal(true)}
          className={styles.buttonSecondary}
        >
          API Data Info
        </button>
      </div>
      <p className={styles.description}>
        Test each platform's API. You need to set environment variables.
      </p>

      <div className={styles.grid}>
        {platforms.map((platform) => (
          <div key={platform.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 style={{ color: platform.color }}>{platform.label}</h2>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => testApi(platform.name, false)}
                  disabled={loading[platform.name]}
                  className={styles.button}
                  style={{ backgroundColor: platform.color }}
                >
                  {loading[platform.name] ? 'Testing...' : 'Test API'}
                </button>
                {platform.name === 'instagram' && (
                  <>
                    <button
                      onClick={() => testApi(platform.name, true)}
                      disabled={loading[platform.name]}
                      className={styles.buttonSecondary}
                      style={{ borderColor: platform.color, color: platform.color }}
                    >
                      {loading[platform.name] ? 'Loading...' : 'Get Posts'}
                    </button>
                    <button
                      onClick={() => testApi(platform.name, true, filters.instagram)}
                      disabled={loading[platform.name]}
                      className={styles.buttonSecondary}
                      style={{ borderColor: platform.color, color: platform.color }}
                    >
                      {loading[platform.name] ? 'Filtering...' : 'Apply Filter'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Instagram 필터 UI */}
            {platform.name === 'instagram' && (
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Filter Options</h3>
                <div className={styles.filterGrid}>
                  <div className={styles.filterItem}>
                    <label>Hashtag (e.g., travel)</label>
                    <input
                      type="text"
                      placeholder="#travel"
                      value={filters.instagram.hashtag}
                      onChange={(e) => handleFilterChange('instagram', 'hashtag', e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <label>Keyword (search caption)</label>
                    <input
                      type="text"
                      placeholder="Enter keyword"
                      value={filters.instagram.keyword}
                      onChange={(e) => handleFilterChange('instagram', 'keyword', e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <label htmlFor="mediaType-select">Media Type</label>
                    <select
                      id="mediaType-select"
                      value={filters.instagram.mediaType}
                      onChange={(e) => handleFilterChange('instagram', 'mediaType', e.target.value)}
                      className={styles.filterSelect}
                      title="Select media type"
                    >
                      <option value="">All</option>
                      <option value="IMAGE">Image</option>
                      <option value="VIDEO">Video</option>
                      <option value="CAROUSEL_ALBUM">Carousel</option>
                    </select>
                  </div>
                  <div className={styles.filterItem}>
                    <label>Post ID</label>
                    <input
                      type="text"
                      placeholder="Specific post ID"
                      value={filters.instagram.postId}
                      onChange={(e) => handleFilterChange('instagram', 'postId', e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  <div className={styles.filterItem}>
                    <label htmlFor="sortBy-select">Sort By</label>
                    <select
                      id="sortBy-select"
                      value={filters.instagram.sortBy}
                      onChange={(e) => handleFilterChange('instagram', 'sortBy', e.target.value)}
                      className={styles.filterSelect}
                      title="Select sort option"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="comments">Most Comments</option>
                      <option value="likes">Most Likes</option>
                      <option value="views">Most Views (Insights required)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {results[platform.name] && (
              <div className={styles.result}>
                <div className={styles.resultHeader}>
                  <span
                    className={`${styles.status} ${
                      results[platform.name].success
                        ? styles.success
                        : styles.error
                    }`}
                  >
                    {results[platform.name].success ? '✓ Success' : '✗ Failed'}
                  </span>
                  {results[platform.name].success && 
                   results[platform.name].data?.posts && (
                    <span className={styles.postsCount}>
                      {results[platform.name].data.postsCount || 0} posts
                      {results[platform.name].data.totalPostsBeforeFilter && 
                       results[platform.name].data.totalPostsBeforeFilter !== results[platform.name].data.postsCount && (
                        <span className={styles.filteredCount}>
                          {' '}(of {results[platform.name].data.totalPostsBeforeFilter} total)
                        </span>
                      )}
                    </span>
                  )}
                </div>
                
                {/* 필터 정보 표시 */}
                {results[platform.name].success && 
                 results[platform.name].data?.filters && (
                  <div className={styles.activeFilters}>
                    <strong>Applied Filters:</strong>
                    {results[platform.name].data.filters.hashtag && (
                      <span className={styles.filterTag}>#{results[platform.name].data.filters.hashtag}</span>
                    )}
                    {results[platform.name].data.filters.keyword && (
                      <span className={styles.filterTag}>Keyword: {results[platform.name].data.filters.keyword}</span>
                    )}
                    {results[platform.name].data.filters.mediaType && (
                      <span className={styles.filterTag}>Type: {results[platform.name].data.filters.mediaType}</span>
                    )}
                    {results[platform.name].data.filters.postId && (
                      <span className={styles.filterTag}>ID: {results[platform.name].data.filters.postId}</span>
                    )}
                    {results[platform.name].data.filters.sortBy && (
                      <span className={styles.filterTag}>
                        Sort: {
                          results[platform.name].data.filters.sortBy === 'recent' ? 'Most Recent' :
                          results[platform.name].data.filters.sortBy === 'comments' ? 'Most Comments' :
                          results[platform.name].data.filters.sortBy === 'likes' ? 'Most Likes' :
                          results[platform.name].data.filters.sortBy === 'views' ? 'Most Views' :
                          results[platform.name].data.filters.sortBy
                        }
                      </span>
                    )}
                  </div>
                )}
                
                {/* Instagram 포스트 표시 */}
                {platform.name === 'instagram' && 
                 results[platform.name].success && 
                 results[platform.name].data?.posts && 
                 results[platform.name].data.posts.length > 0 && (
                  <div className={styles.postsGrid}>
                    {results[platform.name].data.posts.map((post: any) => (
                      <div 
                        key={post.id} 
                        className={`${styles.postCard} ${selectedPost?.id === post.id ? styles.postCardSelected : ''} ${styles.postCardClickable}`}
                        onClick={async () => {
                          if (selectedPost?.id === post.id) {
                            setSelectedPost(null)
                          } else {
                            setLoadingPostDetails(true)
                            try {
                              // 포스트 상세 정보 다시 가져오기 (모든 필드 포함)
                              const response = await fetch(`/api/instagram?postId=${post.id}`)
                              const data = await response.json()
                              if (data.success && data.data?.posts?.[0]) {
                                setSelectedPost(data.data.posts[0])
                              } else {
                                setSelectedPost(post) // 실패 시 기존 데이터 사용
                              }
                            } catch (error) {
                              setSelectedPost(post) // 에러 시 기존 데이터 사용
                            } finally {
                              setLoadingPostDetails(false)
                            }
                          }
                        }}
                      >
                        {post.media_type === 'IMAGE' && post.media_url && (
                          <img 
                            src={post.media_url} 
                            alt={post.caption || 'Instagram post'}
                            className={styles.postImage}
                          />
                        )}
                        {post.media_type === 'VIDEO' && post.thumbnail_url && (
                          <div className={styles.videoThumbnail}>
                            <img 
                              src={post.thumbnail_url} 
                              alt={post.caption || 'Instagram video'}
                              className={styles.postImage}
                            />
                            <div className={styles.videoBadge}>VIDEO</div>
                          </div>
                        )}
                        {post.media_type === 'CAROUSEL_ALBUM' && post.media_url && (
                          <div className={styles.carouselThumbnail}>
                            <img 
                              src={post.media_url} 
                              alt={post.caption || 'Instagram carousel'}
                              className={styles.postImage}
                            />
                            <div className={styles.carouselBadge}>CAROUSEL</div>
                          </div>
                        )}
                        {post.caption && (
                          <p className={styles.postCaption}>
                            {post.caption.length > 100 
                              ? `${post.caption.substring(0, 100)}...` 
                              : post.caption}
                          </p>
                        )}
                        <div className={styles.postMeta}>
                          {post.like_count !== undefined && (
                            <span>❤️ {post.like_count.toLocaleString()}</span>
                          )}
                          {post.comments_count !== undefined && (
                            <span>💬 {post.comments_count.toLocaleString()}</span>
                          )}
                          {post.views_count !== undefined && (
                            <span>👁️ {post.views_count.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Post Details */}
      {selectedPost && (
        <div className={styles.postDetails}>
          <div className={styles.postDetailsHeader}>
            <h3>Post API Details - All Fields</h3>
            <button
              onClick={() => setSelectedPost(null)}
              className={styles.modalClose}
            >
              ×
            </button>
          </div>
          {loadingPostDetails ? (
            <div className={styles.postDetailsContent}>
              <p className={styles.loadingText}>Loading detailed information...</p>
            </div>
          ) : (
            <div className={styles.postDetailsContent}>
              <div className={styles.postDetailsSection}>
                <h4>Media/Post Fields</h4>
                <pre className={styles.code}>
                  {JSON.stringify({
                    id: selectedPost.id,
                    caption: selectedPost.caption,
                    media_type: selectedPost.media_type,
                    media_url: selectedPost.media_url,
                    permalink: selectedPost.permalink,
                    thumbnail_url: selectedPost.thumbnail_url,
                    timestamp: selectedPost.timestamp,
                    like_count: selectedPost.like_count,
                    comments_count: selectedPost.comments_count,
                    is_comment_enabled: selectedPost.is_comment_enabled,
                    shortcode: selectedPost.shortcode,
                    children: selectedPost.children,
                    location: selectedPost.location,
                    username: selectedPost.username,
                    owner: selectedPost.owner,
                  }, null, 2)}
                </pre>
              </div>
              
              {(selectedPost.impressions || selectedPost.reach || selectedPost.engagement || selectedPost.saved || selectedPost.video_views || selectedPost.video_view_time) && (
                <div className={styles.postDetailsSection}>
                  <h4>Insights Fields (Business/Creator Account Required)</h4>
                  <pre className={styles.code}>
                    {JSON.stringify({
                      impressions: selectedPost.impressions,
                      reach: selectedPost.reach,
                      engagement: selectedPost.engagement,
                      saved: selectedPost.saved,
                      video_views: selectedPost.video_views,
                      video_view_time: selectedPost.video_view_time,
                      views_count: selectedPost.views_count,
                    }, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className={styles.postDetailsSection}>
                <h4>Complete Raw Data</h4>
                <pre className={styles.code}>
                  {JSON.stringify(selectedPost, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* API Data Info Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Instagram API Data Fields</h2>
              <button
                onClick={() => setShowModal(false)}
                className={styles.modalClose}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3>User Fields</h3>
                <ul className={styles.fieldList}>
                  <li><code>id</code> - User ID</li>
                  <li><code>username</code> - Username</li>
                  <li><code>account_type</code> - Account type (BUSINESS, CREATOR, PERSONAL)</li>
                  <li><code>media_count</code> - Total media count</li>
                  <li><code>ig_id</code> - Instagram ID (numeric)</li>
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h3>Media/Post Fields</h3>
                <ul className={styles.fieldList}>
                  <li><code>id</code> - Media ID</li>
                  <li><code>caption</code> - Post caption</li>
                  <li><code>media_type</code> - IMAGE, VIDEO, CAROUSEL_ALBUM</li>
                  <li><code>media_url</code> - Media URL</li>
                  <li><code>permalink</code> - Instagram post link</li>
                  <li><code>thumbnail_url</code> - Thumbnail URL</li>
                  <li><code>timestamp</code> - Post time (ISO 8601)</li>
                  <li><code>like_count</code> - Number of likes</li>
                  <li><code>comments_count</code> - Number of comments</li>
                  <li><code>is_comment_enabled</code> - Comment enabled status</li>
                  <li><code>shortcode</code> - Short code for URL</li>
                  <li><code>children</code> - Carousel sub-media</li>
                  <li><code>location</code> - Location information</li>
                  <li><code>hashtags</code> - Hashtag list</li>
                  <li><code>mentions</code> - Mentioned users</li>
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h3>Insights Fields (Business/Creator Account Required)</h3>
                <ul className={styles.fieldList}>
                  <li><code>impressions</code> - View count</li>
                  <li><code>reach</code> - Reach count</li>
                  <li><code>engagement</code> - Engagement count</li>
                  <li><code>saved</code> - Save count</li>
                  <li><code>video_views</code> - Video view count</li>
                  <li><code>video_view_time</code> - Video watch time (seconds)</li>
                  <li><code>followers_count</code> - Follower count</li>
                  <li><code>profile_views</code> - Profile view count</li>
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h3>Filtering Options</h3>
                <ul className={styles.fieldList}>
                  <li><strong>Hashtag Filter</strong> - Search by hashtag in caption</li>
                  <li><strong>Keyword Filter</strong> - Search by keyword in caption</li>
                  <li><strong>Media Type Filter</strong> - Filter by IMAGE, VIDEO, CAROUSEL_ALBUM</li>
                  <li><strong>Date Range Filter</strong> - Filter by timestamp (e.g., last 7 days)</li>
                  <li><strong>Like/Comment Count Filter</strong> - Filter by min/max values</li>
                  <li><strong>Post ID Filter</strong> - Get specific post by ID</li>
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h3>Sorting Options</h3>
                <ul className={styles.fieldList}>
                  <li><strong>Most Recent</strong> - Sort by timestamp (descending)</li>
                  <li><strong>Most Comments</strong> - Sort by comments_count (descending)</li>
                  <li><strong>Most Likes</strong> - Sort by like_count (descending)</li>
                  <li><strong>Most Views</strong> - Sort by impressions (descending, Insights required)</li>
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h3>API Endpoints</h3>
                <ul className={styles.fieldList}>
                  <li><code>GET /{'{user-id}'}?fields=...</code> - Get user info</li>
                  <li><code>GET /{'{user-id}'}/media?fields=...</code> - Get media list</li>
                  <li><code>GET /{'{media-id}'}?fields=...</code> - Get specific media</li>
                  <li><code>GET /{'{media-id}'}/insights?metric=...</code> - Get media insights</li>
                  <li><code>GET /{'{user-id}'}/insights?metric=...</code> - Get account insights</li>
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h3>Currently Implemented</h3>
                <ul className={styles.fieldList}>
                  <li>✓ User info retrieval</li>
                  <li>✓ Media list retrieval</li>
                  <li>✓ Basic media fields</li>
                  <li>✓ Statistics fields (likes, comments)</li>
                  <li>✓ Hashtag, keyword, media type filters</li>
                  <li>✓ Post ID lookup</li>
                  <li>✓ Sorting (recent, comments, likes, views)</li>
                  <li>✓ Insights API integration (views)</li>
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h3>Limitations</h3>
                <ul className={styles.fieldList}>
                  <li>Insights API requires Business or Creator account</li>
                  <li>Hashtag search requires Business account</li>
                  <li>API rate limit: ~200 requests per hour</li>
                  <li>Only data with app permissions is accessible</li>
                  <li>Caption max length: 2,200 characters</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

