const axios =  require('axios');

const API_URL = process.env.API_URL || 'http://api:3333/api/';

module.exports.formatTime = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

module.exports.formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);
  
  if (diffSeconds < 60) {
    return 'Há poucos instantes';
  }
  
  if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

module.exports.getPublicItems = async (query) => {
  try {
    let url = API_URL + "items/public";
    let params = [];

    if (query.tipo) {
      if (Array.isArray(query.tipo)) {
        query.tipo.forEach(t => params.push(`tipo=${encodeURIComponent(t)}`));
      } else {
        params.push(`tipo=${encodeURIComponent(query.tipo)}`);
      }
    }

    if (query.classificador) {
      if (Array.isArray(query.classificador)) {
        query.classificador.forEach(c => params.push(`classificador=${encodeURIComponent(c)}`));
      } else {
        params.push(`classificador=${encodeURIComponent(query.classificador)}`);
      }
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error('Erro a obter os posts públicos:', err.message);
    return [];
  }
};

module.exports.getUserItems = async (token, query) => {
  try {
    var url = API_URL + "items"
    let params = [];

    if (query.tipo) {
      if (Array.isArray(query.tipo)) {
        query.tipo.forEach(t => params.push(`tipo=${encodeURIComponent(t)}`));
      } else {
        params.push(`tipo=${encodeURIComponent(query.tipo)}`);
      }
    }

    if (query.classificador) {
      if (Array.isArray(query.classificador)) {
        query.classificador.forEach(c => params.push(`classificador=${encodeURIComponent(c)}`));
      } else {
        params.push(`classificador=${encodeURIComponent(query.classificador)}`);
      }
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data
  } catch (err) {
    console.error('Erro a obter os posts:', err.message);
    return [];
  }
};

module.exports.getItemById = async (id,token) => {
  try {
    const url = API_URL + `items/${id}`
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return {
      success: true,
      data: response.data 
    };
  } catch (error) {
     const status = error.response.status;
     console.error(`Erro ao obter item ${id}: ${status} - ${error.message}`)
  }
}

module.exports.getCommentsByItem = async (id) => {
  try{
    const url = API_URL + `comments/item/${id}`
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data 
    }
  }catch (error) {
     const status = error.response.status;
     console.error(`Erro ao obter comentários do post ${id}: ${status} - ${error.message}`)
  }
}

module.exports.uploadComment = async (token, item_id, descricao) => {
  try {
    const url = API_URL + 'comments/upload';

    console.log(token)
    const response = await axios.post(url, {
        item_id: item_id,
        descricao: descricao
      },
       {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Erro ao enviar comentário: ${error.message}`);
    throw error;
  }
}

module.exports.getFile = async (id,path) => {
  try {
    var url = API_URL + `files/public/${id}/${path}`
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (err) {
    console.error('Erro ao obter ficheiro:', err.message);
    return null;
  }
};

module.exports.login = async(username, password) => {
  try {
    const url = API_URL + 'users/login'
    const response = await axios.post(url, {
      username,
      password
    })

    return response.data;
  } catch (err) {
    console.error('Erro no login:', err.message);
    return null;
  }
};

module.exports.getItemsFromCertainUser = async (token, user_id, query) => {
  try {
    var url = API_URL + `items/user/${user_id}`
    let params = [];

    if (query.tipo) {
      if (Array.isArray(query.tipo)) {
        query.tipo.forEach(t => params.push(`tipo=${encodeURIComponent(t)}`));
      } else {
        params.push(`tipo=${encodeURIComponent(query.tipo)}`);
      }
    }

    if (query.classificador) {
      if (Array.isArray(query.classificador)) {
        query.classificador.forEach(c => params.push(`classificador=${encodeURIComponent(c)}`));
      } else {
        params.push(`classificador=${encodeURIComponent(query.classificador)}`);
      }
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (err) {
    console.error('Erro a obter perfil do utilizador:', err.message);
    return [];
  }
};

module.exports.getUserInfo = async (user_id) => {
  try {
    var url = API_URL + `users/${user_id}`

    const response = await axios.get(url);

    return response.data;
  } catch (err) {
    console.error('Erro a obter perfil do utilizador:', err.message);
    return [];
  }
}

module.exports.changeItemVisibility = async (token, item_id, visible) => {
  try {
    var url = API_URL + `items/${item_id}/visibility`

    const response = await axios.put(
      url, 
      { visible: visible},
      { headers: { Authorization: 'Bearer ' + token } }
    );

    return response.data;

  } catch (err) {
    console.error('Erro a obter perfil do utilizador:', err.message);
    return [];
  }
}

module.exports.registerUser = async (userData) => {
  try{
      const url = API_URL + 'users/register';

      const response = await axios.post(url,userData);
      return{
        data: response.data
      };
  }catch(err){
      console.error(`Erro ao registar usuário: ${err.message}`);
      return {
        success: false,
        message: err.message
    };
  }
}

module.exports.getItemLikes = async (item_id) => {
  try {
    const url = API_URL + `items/${item_id}/likes`;
    const response = await axios.get(url);
    return response.data;
  } catch(err) {
    console.error(`Erro ao buscar os likes: ${err.message}`);
    return {
      message: err.message
    }
  }
}
