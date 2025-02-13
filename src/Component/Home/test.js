import React, { Component } from "react";
import axios from "axios";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      priceInfo: [], // Array of price data
      news: "", // Single news item
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchCrops();
    // this.fetchLocation();
  }



  fetchCrops = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('http://43.201.122.113:8081/api/farm/weather', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);

    } catch (error) {
      console.error('Failed to fetch crops:', error);
    }
  };



  render() {
    const { loading, location, error } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <div>
        <h1>Location Data:</h1>
        <pre>{JSON.stringify(location, null, 2)}</pre>
      </div>
    );
  }
}

export default Test;
