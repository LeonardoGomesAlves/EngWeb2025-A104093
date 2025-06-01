const User = require('../models/user')

module.exports.countDocuments = () => {
  return User.countDocuments().exec();
}

module.exports.getUserInfo = (user_id) => {
    return User
        .findOne({username: user_id})
        .select('username name creationDate email level avatar facebookId') 
        .exec()
}

module.exports.getUserFromSearch = (query) => {
    return User
        .find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        })
        .select('username name creationDate avatar') 
        .exec();
}

module.exports.getUserByUsername = (username) => {
    return User.findOne({username:username}).exec()
}

module.exports.changeName = async (username, newName) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return { success: false, message: "Utilizador não encontrado" };

    user.name = newName;
    await user.save();
    return { success: true, message: "Nome alterado com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro ao alterar nome." };
  }
};

module.exports.updateAvatar = async (username, avatarUrl) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return { success: false, message: "Utilizador não encontrado" };
    }

    user.avatar = avatarUrl;
    await user.save();
    
    return { 
      success: true, 
      message: "Avatar atualizado com sucesso!",
      avatarUrl: avatarUrl 
    };
  } catch (err) {
    console.error('Erro ao atualizar avatar:', err);
    return { 
      success: false, 
      message: "Erro ao atualizar avatar." 
    };
  }
};

module.exports.updateUser = async (username, updateData) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return null;
    }

    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.level !== undefined) user.level = updateData.level;


    if (updateData.password) {
      user.setPassword(updateData.password, async function(err) {
        if (err) throw err;
        await user.save();
      });
      return {
        username: user.username,
        name: user.name,
        email: user.email,
        level: user.level,
        creationDate: user.creationDate
      };
    } else {
      await user.save();
      return {
        username: user.username,
        name: user.name,
        email: user.email,
        level: user.level,
        creationDate: user.creationDate
      };
    }
  } catch (error) {
    return null;
  }
}


module.exports.getUsers = () => {
  return User
          .find()
          .exec()
}

module.exports.deleteUser = (user_id) => {
  return User
        .findOneAndDelete({username: user_id})
        .exec()
}
