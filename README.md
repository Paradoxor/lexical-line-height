# lexical-line-height
Adds a simple line height selector to the toolbar

**To run it locally checkout the lexical example**

Copy the LineHeightPlugin Folder into your plugins and 
add it to the Toolbar with the following code
```
import LineHeight from '../LineHeightPlugin';

<!-- Handle the state of a selected item -->
const [lineHeight, setLineHeight] = useState<string>('1');
setLineHeight(
    $getSelectionStyleValueForProperty(selection, 'line-height', '1'),
);

<!-- Add this to lexical-toolbar -->
<LineHeight
    editor={editor}
    value={lineHeight}
    disabled={!isEditable}
/>