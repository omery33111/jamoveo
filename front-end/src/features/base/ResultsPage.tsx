import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';



const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { searchResults } = location.state || { searchResults: [] };

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketStatus, setSocketStatus] = useState<{ isOpen: boolean }>({isOpen: false});

  useEffect(() => {
    const socketInstance = new WebSocket(`${process.env.REACT_APP_BACKEND_URL}/ws/chat/`);

    setSocket(socketInstance);

    socketInstance.onopen = () => {
      console.log('WebSocket is open now.');
      setSocketStatus({ isOpen: true });
    };

    socketInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.room) {
        navigate(`livepage/${data.room}`);
      }
    };

    setTimeout(() => {
      socketInstance.onerror = (error) => {
        console.error('WebSocket error:', error);
        setSocketStatus({ isOpen: false });
      };
    }, 500);

    socketInstance.onclose = () => {
      console.log('WebSocket is closed now.');
      setSocketStatus({ isOpen: false });
    };

    setSocketStatus({ isOpen: false });

    return () => {
      if (socketInstance) {
        socketInstance.close();
      }
    };
  }, [navigate]);


  const handleStartLiveShow = (songId: number) => {
    if (socketStatus.isOpen && socket) {
      socket.send(JSON.stringify({ room: songId.toString() }));
    } else {
      console.error('WebSocket is not open. Current status:', socketStatus.isOpen);
    }
  };


  return (
    <div className = "results-container">

    {searchResults.length === 0 && (<div className="empty-search-message"/>)}

      <h1>Search Results</h1>

        {searchResults.length === 0 ? (
          <>
            <b className="no-song-message">There is no such song!</b>
              <br/>
            <Button onClick = {() => navigate('/')} className="main-page-button">Main page</Button>
          </>
        ) : (
        <>
          <ul>
              {searchResults.map((song: any, index: number) => (
              <li key={index}>
                  {song.song_name} - {song.artist} | <b className="start-live-show" onClick={() => handleStartLiveShow(song.id)}>START A LIVE SHOW!</b>
              </li>
              ))}
          </ul>
        </>
      )}


    </div>
  );
}

export default ResultsPage;
