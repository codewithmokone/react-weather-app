import React from 'react';
import '../News/News.css';
import { Box, Hidden } from '@mui/material';


const NewsItem = ({ item }) => {
    const websiteUrl = item.url
    const website = websiteUrl.split('https://').pop().split('/')[0]

    const date = item.publishedAt
    const formatDate = date.replace('T', '')
    const formatTime = formatDate.replace('Z', '')
    return (
        <Box className="main-article">
            <a href={item.url} className='article'>
                <Box
                    sx={{width: { xs: '15%', md:'20%' }, height: { xs: "100%", md:'50%' }, borderWidth:2, borderColor:'green'}} className="article-image">
                    <img src={item.urlToImage} alt={item.title} className="newsImage" />
                </Box>
                <Box
                    sx={{
                        width: { xs: '60%' },
                        height: { xs: '100%' }
                    }}
                    className="article-content">
                    <Box className="article-source">
                        <span>{item.source.name}</span>
                    </Box>
                    <Box className="article-title">
                        <h4>{item.title}</h4>
                    </Box>
                    <Hidden xsDown>
                        <Box className="article-description">
                            <p>{item.description}</p>
                        </Box>
                    </Hidden>

                    <Box className="article-details">
                        <small><b>Published At:</b>{formatTime}</small>
                    </Box>
                </Box>
            </a>
        </Box>

    )
}

export default NewsItem