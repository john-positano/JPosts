# JPosts
A barebones WordPress plugin for creating, reading, updating, and deleting posts from the JSON Placeholder API for Posts.

# Installation
Simply download this repository as a .zip folder, go to `/wp-admin/plugin-install.php` on your WordPress installation, click "Upload Plugin", select the .zip folder, install, and activate!

# Usage
Visit `/wp-admin/options-general.php?page=jposts-manager` on your WordPress installation to see JPosts Manager in action.

Posts can be edited and saved with ease, by simply typing into the individual post editors and clicking "Save". Changes can be undone and redone using standard Ctrl + Z (Undo) and Ctrl + Y (Redo) commands. Posts can be deleted by clicking "Delete", where you will prompted as to whether or not you are sure of this action. New posts can be made by clicking "Create +" and filling out the relevant information. **NOTE:** because this plugin uses a mock API, new posts will throw an error when attempting to be edited because state is not persistent. Therefore creating `PUT` requests for a post with ID greater than 100 will throw a `500`

The bodies of the posts can be searched simply by typing your query into the top right input labeled "Search Post Bodies"

# Developer Notes
## Technologies Chosen
* React 18
* Bootstrap 5

## Desirables
* Pagination for neater content display
* Using WP User registry to present actual author name instead of just user ID

## Notes
* For the sake of simplicity, packages were "frozen" by copying source from a trusty CDN into the `JPostsFrontend/Assets/Modules` folder. This is to avoid:
  * An additional `npm build` process after downloading the plugin
  * Potential `node` versioning problems
  * Having to ship the build with a `dist` folder included in the repo
  * Potentially overcomplicating file structure
* This project could very easily be refactored into a command-line driven build, e.g., with `composer` and `create-react-app`
* Responsiveness is present, but not perfect. More attention could have been given to styling components.
* Validation only checks that the required fields are not empty
