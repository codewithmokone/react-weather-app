import React from 'react'
import NewsItem from '../News/NewsItem'

const NewsGrid = ({news}) => {

    return (
        <div className="news-grid">
            {news.map((item, i) => (
                <NewsItem key={i} item={item} />
            ))}
        </div>
    )
}

export default NewsGrid