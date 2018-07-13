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
    this.getCurrentLiveStream()
  }

  render() {
    return (
      <Grid>
        <PageHeader style={{textAlign: 'left'}}>
          Your Video
        </PageHeader>
        <iframe
          width="420"
          height="315"
          src={`https://www.youtube.com/embed/${window.location.search.split('=')[1]}`}
        />
      </Grid>
    )
  }
  
  getCurrentLiveStream = () => {
    if (!window.gapi.client.youtube) {
      this.loadYoutubeApi()
      return
    }

    // const searchRequest = window.gapi.client.youtube.search.list({
    //   part: 'snippet',
    //   maxResults: '3',
    //   type: 'video',
    //   eventType: 'live',
    // })
    // searchRequest.execute(({ items: videos }) => {
    //   this.setState({ videos })
    // })
  }
  
  loadYoutubeApi = () => {
    window.gapi.client.load('youtube', 'v3', (response) => {
      this.getCurrentLiveStream()
    })
  }
}