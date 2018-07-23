import React from 'react'
import debounce from 'lodash/debounce'
import {
  Grid,
  Col,
  Row,
  PageHeader,
  Table,
  FormControl,
} from 'react-bootstrap'
import Api from '../Api'

export default class Stats extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      videoId: window.location.search.split('=')[1],
      videoInfo: {},
      messages: [],
      filter: '',
    }
    // this will stop the client from spamming the server by only
    // sending the requests once the user stops typing for 250ms
    this.throttledGetVideoStats = debounce(this.getVideoStats, 250, { trailing: true, leading: false })
  }
  
  componentDidMount() {
    this.getVideoInfo()
    this.getVideoStats()
  }
  
  render() {
    return (
      <Grid>
        <PageHeader className="page-header-left">
          Stats
        </PageHeader>
        
        <Row>
          <Col md={4} xs={12}>
            <FormControl
              type="text"
              value={this.state.filter}
              placeholder="Filter Messages by Author or Content"
              onChange={this.onChangeFilter}
            />
          </Col>
          <Col md={8} xs={12}></Col>
        </Row>
        
        <Table responsive className="stats-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Content</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {this.state.messages.map((message, index) => (
              <tr key={index}>
                <td>{message.author}</td>
                <td>{message.text}</td>
                <td>{message.created_at}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Grid>
    )
  }
  
  onChangeFilter = ({ target: { value } }) => {
    this.setState({ filter: value }, () => this.throttledGetVideoStats(this.state.filter))
  }
  
  getVideoInfo = () => {
    const currentVideo = window.gapi.client.youtube.videos.list({
      id: this.state.videoId,
      part: 'snippet',
    })
    currentVideo.execute(({ items: videos }) => {
      this.setState({
        videoInfo: videos[0].snippet
      })
    })
  }
  
  getVideoStats = (filter = '') => {
    Api.getVideoStats({ filter, videoId: this.state.videoId }, ({ messages }) => {
      this.setState({ messages })
    })
  }
}