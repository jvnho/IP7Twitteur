
function getQuery(queryType, index, userID, searchFor){
    switch(queryType)
    {

        case "all":    
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
            WHERE pub.at_everyone = true 
            AND pub.author_id = u.user_id AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC`;


        case "sub":   
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


        case "me":
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
            WHERE mention.user_mentionned = (SELECT u0.username FROM user AS u0 WHERE u0.user_id = `+ userID +`)
            AND pub.publication_id = mention.publication_id AND pub.author_id = u.user_id
            AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC`;


        case "liked":  
            return `SELECT pub.*,u.*, true AS liked,
            (SELECT COUNT(*) AS nbr_like FROM publication_reaction AS r WHERE pub.publication_id = r.publication_id) AS nbr_like,
            CASE WHEN EXISTS (SELECT * FROM user_subscription AS sub
                WHERE sub.user_id = `+ userID +` 
                AND sub.subscribe_to = pub.author_id) 
                THEN true ELSE false END AS subscribed
            FROM publication as pub, publication_reaction as react, user as u
            WHERE react.liked = true 
            AND react.reactor_id = `+ userID +` AND pub.publication_id = react.publication_id
            AND pub.author_id = u.user_id AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC`;


        case "search":
            if(userID != -1) //utilisateur connecté faisant une recherche
            {
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
                FROM user AS u, publication AS pub
                WHERE 
                    (u.username = '`+ searchFor +`' 
                    AND pub.author_id = u.user_id)
                OR (
                    pub.content LIKE CONCAT('%','`+ searchFor +`','%') 
                    AND pub.author_id = u.user_id)
                ORDER BY pub.publication_id DESC;`
            }
            else {
                return `SELECT pub.*, u.* FROM user AS u, publication AS pub
                WHERE 
                    (u.username = '`+ searchFor +`' 
                    AND pub.author_id = u.user_id)
                OR (
                    pub.content LIKE CONCAT('%','`+ searchFor +`','%') 
                    AND pub.author_id = u.user_id)
                ORDER BY pub.publication_id DESC;`
            }
        case "nosession":
            return `SELECT pub.*, u.* FROM publication as pub, user as u 
            WHERE pub.author_id = u.user_id 
            AND pub.publication_id > ` + index + `
            ORDER BY pub.publication_id DESC;`;
    }
}

module.exports = { getQuery }