# Deploying Your Retention ML Model for Free

Now that you have your `retention_model.pkl`, you need a place to host it so that your PlaceIQ React/Node application can talk to it via API. Since you want free alternatives, **Hugging Face Spaces** or **Render** are the two best options.

I highly recommend **Hugging Face Spaces** because it is 100% free forever for simple inference APIs, and it is explicitly built for Machine Learning models!

Here is the step-by-step guide to uploading your model to Hugging Face and connecting it to PlaceIQ.

---

## Part 1: Uploading to Hugging Face Spaces (Free)

### 1. Create a Hugging Face Space
1. Go to [Hugging Face](https://huggingface.co/) and create a free account.
2. Click on your profile picture (top right) -> **New Space**.
3. **Space Name:** `placeiq-retention-predictor`
4. **License:** MIT
5. **Select the Space SDK:** Choose **Gradio**. *(Even though we want an API, Gradio makes it incredibly easy to expose a Python API automatically)*.
6. **Space Hardware:** Free (CPU basic).
7. Click **Create space**.

### 2. Upload Your Files
In your new Space, click on the **Files** tab. You need to upload/create 3 exact files:

**File 1: Upload `retention_model.pkl`**
- Click "Add file" -> "Upload files".
- Upload the `retention_model.pkl` file we just created.

**File 2: Create `requirements.txt`**
- Click "Add file" -> "Create new file". Name it `requirements.txt`.
- Add these exactly:
```text
scikit-learn
pandas
joblib
```

**File 3: Create `app.py`**
- Click "Add file" -> "Create new file". Name it `app.py`.
- Paste this Python code block and commit it:

```python
import gradio as gr
import joblib

# Load the model directly
model = joblib.load('retention_model.pkl')

def predict_dropout(avg_hours, weekly_hours, days_since_active, lessons, focus, distract, readiness, total_xp, enrolled):
    # Features must match the exact order we trained them on
    features = [[
        avg_hours, weekly_hours, days_since_active, lessons, 
        focus, distract, readiness, total_xp, enrolled
    ]]
    
    # Get probability of dropping out (1)
    risk_prob = model.predict_proba(features)[0][1] 
    
    # Return formatted JSON-like dict
    is_high_risk = bool(risk_prob > 0.70)
    
    return {"is_high_risk": is_high_risk, "risk_probability_percentage": round(risk_prob * 100, 2)}

# Create the Gradio interface
# Even though it's a UI, Gradio automatically creates a headless REST API for us at the /call/predict endpoint!
iface = gr.Interface(
    fn=predict_dropout,
    inputs=[
        gr.Number(label="avg_hours_per_day"),
        gr.Number(label="total_weekly_hours"),
        gr.Number(label="days_since_last_active"),
        gr.Number(label="lessons_completed"),
        gr.Number(label="focus_score"),
        gr.Number(label="distract_score"),
        gr.Number(label="readiness_score"),
        gr.Number(label="total_xp"),
        gr.Number(label="enrolled_courses")
    ],
    outputs="json"
)

iface.launch()
```

### 3. Let it Build
Once you commit `app.py`, Hugging Face will automatically start "Building" your space container. After 1-2 minutes, it will say **Running**. Your ML API is now live on the internet! 🚀

---

## Part 2: Connecting the Model to PlaceIQ

Your model is now hosted and exposing an API endpoint at:
`https://Sugan145-placeiq-retention-predictor.hf.space/call/predict`

There are **two ways** you can connect this to your PlaceIQ app. The first method is best for real-time checks on the frontend, and the second is best for automated background checks via Supabase.

### Option A: Trigger directly from Frontend (React component)
If you want to quickly check a student's dropout risk directly from a React page (like the Analytics Page or Dashboard), you can simply use JavaScript `fetch`.

```javascript
// Example: Put this function inside a React component
async function checkStudentRisk() {
  // Your LIVE Hugging Face API URL
  const hfApiUrl = "https://Sugan145-placeiq-retention-predictor.hf.space/call/predict";
  
  try {
    const response = await fetch(hfApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          1.5,   // avg_hours_per_day
          10.5,  // total_weekly_hours
          2,     // days_since_last_active
          4,     // lessons_completed
          85,    // focus_score
          15,    // distract_score
          72,    // readiness_score
          2500,  // total_xp
          2      // enrolled_courses
        ]
      })
    });

    const result = await response.json();
    console.log("Prediction Result:", result);
    
    // Result object has a 'data' array with our outputs
    const isHighRisk = result.data[0].is_high_risk;
    const probability = result.data[0].risk_probability_percentage;

    if (isHighRisk) {
        alert(`Warning! This student has a ${probability}% chance of dropping out.`);
        // You could also run: supabase.from('notifications').insert(...)
    }
    
  } catch (err) {
    console.error("AI Prediction Failed:", err);
  }
}
```

### Option B: The Ultimate Setup (Supabase Edge Function)
For a proper production deployment, retention prediction should happen in the background without the student needing to open the app. You can create a **Supabase Edge Function** to handle this!

1. **Create the function locally**: Run this in your terminal.
   ```bash
   npx supabase functions new check-student-retention
   ```
2. **Add the logic**: Inside `supabase/functions/check-student-retention/index.ts`, you would query your `students` and `Analytics` data using Supabase, then `fetch` to your Hugging Face API URL just like the code above.
3. **If the AI says `is_high_risk: true`**, your Edge Function instantly inserts a warning message into your `notifications` table for the Mentor.
1. **Deploy the Function**: In your terminal, run the following:
   ```bash
   npx supabase functions deploy check-retention
   ```
2. **Execute SQL Schedule script**: If you haven't yet, take everything in the `setup_notifications_table.sql` and `retention_cron_trigger.sql` artifacts generated earlier, and run them exactly as they are in your Supabase SQL Editor. This will automatically execute your model every midnight!

Now you have a fully autonomous AI reviewing your students nightly and giving mentors alerts natively inside the dashboard!
