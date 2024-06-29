import User from "../models/user.js"; // Import the User model

export async function getUserDetails(id) {
    try {
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return 'User not found';
        }
        const { last_name, email } = user;
        return { id, last_name, email };
    } catch (error) {
        console.error(error);
        return 'An error occurred where requesting user ' + id + '\'s details';
    }
}