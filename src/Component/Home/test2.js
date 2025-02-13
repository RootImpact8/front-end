import React, { Component } from "react";
import axios from "axios";

class Test2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchLocation();
  }

  fetchLocation = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem('id'); // Ensure 'userId' is correctly fetched

    try {
      const response = await axios.get(`http://43.201.122.113:8081/api/farm/ai-recommendation?userId=${userId}&cropId=3`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({ location: response.data, loading: false });
    } catch (error) {
      console.error("API request failed:", error);
      this.setState({ error: error.toString(), loading: false });
    }
  };

  render() {
    const { location, error, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <h1>Location Data:</h1>
        {location && <pre>{JSON.stringify(location, null, 2)}</pre>}
      </div>
    );
  }
}

export default Test2;
