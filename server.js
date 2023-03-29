require("dotenv").config();
require("./src/config/database");
require("./src/config/express");


// Token.find({ userId: user._id }).then((result) => {
//     if (result.length > 0) {
//       const { expiresAt } = result[0];

//       if (expiresAt < Date.now()) {
//         Token.deleteOne(user._id);
//       }
//     }
//   });