# *Jinseok Kim* API Documentation
*This API provides endpoints for a game application, allowing clients to fetch game images, record survival time, and get random speed values.*

## *Record Best Survival Time*
**Request Format:** */record/:seconds*

**Request Type:** *GET*

**Returned Data Format**: Plain Text

**Description:** *Fill in description*

**Example Request:** *GET /record/45*

**Example Response:**

```
45
```

**Error Handling:**
400 Bad Request when given parameter is not an integer.
500 Server Error when there was an error calculating and sending the best record.


## *Get Random Speed of Obstacle*
**Request Format:** */speed*

**Request Type:** *GET*

**Returned Data Format**: Plain Text

**Description:** *Returns a random float speed value between 15 and 37.*

**Example Request:** *GET /speed*

**Example Response:**

```
25.672
```

**Error Handling:**
There is no specific error handling for this endpoint as it always returns a random speed.


## *Get Game Images*
**Request Format:** */getImages*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns paths to a random character image and the corresponding obstacle image.*

**Example Request:** GET /getImages*

**Example Response:**

```
{
  "characterPath": "elon-musk.png",
  "obstaclePath": "tesla.png"
}

```

**Error Handling:**
There is no specific error handling for this endpoint as it always returns a valid JSON response.