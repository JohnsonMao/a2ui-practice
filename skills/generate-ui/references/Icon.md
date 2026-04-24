# Icon

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `name` | "accountCircle" \| "add" \| "arrowBack" \| "arrowForward" \| "attachFile" \| "calendarToday" \| "call" \| "camera" \| "check" \| "close" \| "delete" \| "download" \| "edit" \| "event" \| "error" \| "fastForward" \| "favorite" \| "favoriteOff" \| "folder" \| "help" \| "home" \| "info" \| "locationOn" \| "lock" \| "lockOpen" \| "mail" \| "menu" \| "moreVert" \| "moreHoriz" \| "notificationsOff" \| "notifications" \| "pause" \| "payment" \| "person" \| "phone" \| "photo" \| "play" \| "print" \| "refresh" \| "rewind" \| "search" \| "send" \| "settings" \| "share" \| "shoppingCart" \| "skipNext" \| "skipPrevious" \| "star" \| "starHalf" \| "starOff" \| "stop" \| "upload" \| "visibility" \| "visibilityOff" \| "volumeDown" \| "volumeMute" \| "volumeOff" \| "volumeUp" \| "warning" \| object | The name of the icon to display. | — | ✓ |

## JSON Example

```json
{
  "id": "my-icon",
  "component": "Icon",
  "name": "star"
}
```

**Optional props:** `accessibility`, `weight`
