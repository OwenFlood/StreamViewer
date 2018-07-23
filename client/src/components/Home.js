import React from 'react'
import {
  Grid,
  Row,
  Col,
  Image,
  PageHeader,
} from 'react-bootstrap'

export default class Home extends React.Component {
  state = {
    videos: [],
  }

  componentDidMount() {
    this.getYouTubeLiveStreams()
  }

  render() {
    return (
      <Grid>
        <PageHeader className="page-header-left">
          Currently Live
        </PageHeader>
        {this.renderVideos()}
      </Grid>
    )
  }
   
  renderVideos = () => {
    return this.state.videos.map(({ id, snippet }) => (
      <Row key={id.videoId} className="show-grid">
        <Col xs={12} md={4}>
          <Image
            responsive
            src={snippet.thumbnails.medium.url}
          />
        </Col>
        <Col xs={12} md={4}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <a href={`/watch?id=${id.videoId}`}>
                <strong>{snippet.title}</strong>
              </a>
            </div>
            <div>
              Channel: <span style={{ fontWeight: 300 }}>{snippet.channelTitle}</span>
            </div>
            Description: <span style={{ fontWeight: 300 }}>{snippet.description}</span>
          </div>
        </Col>
        <Col xs={12} md={4} />
        {/* <iframe
          width="420"
          height="315"
          src={`https://www.youtube.com/embed/${id.videoId}`}
        /> */}
      </Row>
    ))
  }
  
  getYouTubeLiveStreams = () => {
    // load the youtube api into the gapi client
    window.gapi.client.load('youtube', 'v3', (response) => {
      console.log(response);
      // after the client is loaded, execute the search
      const searchRequest = window.gapi.client.youtube.search.list({
        part: 'snippet',
        maxResults: '3',
        type: 'video',
        eventType: 'live',
      })
      // set state with videos returned from api
      searchRequest.execute(({ items: videos }) => {
        this.setState({ videos })
      })
    })
  }
}