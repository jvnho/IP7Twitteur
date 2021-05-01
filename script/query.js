
function getQuery(queryType, index, userID){
    switch(queryType)
    {

        case "everyone":    
            return `SELECT pub.*, u.*,
            (SELECT COUNT(*) AS nbr_like FROM publication_reaction AS r WHERE pub.publication_id = r.publication_id) AS nbr_like,
            CASE WHEN EXISTS (SELECT * FROM publication_reaction AS r 
                WHERE pub.publication_id = r.publication_id 
                AND r.reactor_id = `+ userID +`) 
                THEN true ELSE false END AS liked,
            CASE WHEN EXISTS (SELECT * FROM user_subscription AS sub
                WHERE sub.user_id = `+ userID +` 
                AND sub.subscribe_to = pub.author_id) 
                THEN true ELSE false END AS subscribed
            FROM publication AS pub, user AS u
            WHERE pub.at_everyone = false 
            AND pub.author_id = u.user_id AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC`;


        case "subscribed":   
            return `SELECT pub.*, u.*, true as subscribed,
            (SELECT COUNT(*) AS nbr_like FROM publication_reaction AS r WHERE pub.publication_id = r.publication_id) AS nbr_like,
            CASE WHEN EXISTS (SELECT * FROM publication_reaction AS r 
                WHERE pub.publication_id = r.publication_id 
                AND r.reactor_id = `+ userID +`) 
                THEN true ELSE false END AS liked
            FROM publication AS pub, user_subscription AS sub, user AS u
            WHERE sub.user_id = `+ userID +`
            AND sub.subscribe_to = pub.author_id AND pub.author_id = u.user_id
            AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC`;


        case "mentionned":    
            return `SELECT pub.*, u.*, 
            (SELECT COUNT(*) AS nbr_like FROM publication_reaction AS r WHERE pub.publication_id = r.publication_id) AS nbr_like,
            CASE WHEN EXISTS (SELECT * FROM publication_reaction AS r 
                WHERE pub.publication_id = r.publication_id 
                AND r.reactor_id = `+ userID +`) 
                THEN true ELSE false END AS liked,
            CASE WHEN EXISTS (SELECT * FROM user_subscription AS sub
                WHERE sub.user_id = `+ userID +` 
                AND sub.subscribe_to = pub.author_id) 
                THEN true ELSE false END AS subscribed
            FROM publication as pub, publication_mention AS mention, user AS u
            WHERE mention.user_mentionned = `+ userID +`
            AND pub.publication_id = mention.publication_id AND pub.author_id = u.user_id
            AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC`;


        case "liked":  
            return `SELECT pub.*,u.*, true AS liked,
            CASE WHEN EXISTS (SELECT * FROM user_subscription AS sub
                WHERE sub.user_id = `+ userID +` 
                AND sub.subscribe_to = pub.author_id) 
                THEN true ELSE false END AS subscribed
            FROM publication as pub, publication_reaction as react, user as u
            WHERE react.liked = true 
            AND react.reactor_id = `+ userID +` AND pub.publication_id = react.publication_id
            AND pub.author_id = u.user_id AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC`;

        default:
            return `SELECT pub.*, u.* FROM publication as pub, user as u 
            WHERE pub.author_id = u.user_id 
            AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC;`;
    }
}

module.exports = { getQuery}