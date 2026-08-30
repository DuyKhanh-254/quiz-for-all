$supabaseUrl = "https://syghsisooccdvpvshgvm.supabase.co"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2hzaXNvb2NjZHZwdnNoZ3ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg3ODM5NSwiZXhwIjoyMTAyNDU0Mzk1fQ.kVg4wYbtpw2T5jqRbNL3g-zDDqeNZsa1WAs1gyFAzfw"

$headers = @{
    "apikey" = $serviceKey
    "Authorization" = "Bearer $serviceKey"
    "Content-Type" = "application/json; charset=utf-8"
    "Prefer" = "resolution=merge-duplicates"
}
$deleteHeaders = @{
    "apikey" = $serviceKey
    "Authorization" = "Bearer $serviceKey"
}

$publicPath = "d:\WEB_QUIZ\content\test-6.public.json"
$privatePath = "d:\WEB_QUIZ\content\test-6.private.json"

$publicContent = Get-Content $publicPath -Raw -Encoding UTF8 | ConvertFrom-Json
$privateAnswers = Get-Content $privatePath -Raw -Encoding UTF8 | ConvertFrom-Json

$cleanAssetBase = if ($publicContent.assetBase.StartsWith("quiz-assets/")) { $publicContent.assetBase } else { "quiz-assets/$($publicContent.assetBase)" }
$storageBase = "$supabaseUrl/storage/v1/object/public/$cleanAssetBase"

Write-Host "Importing Quiz: $($publicContent.quiz.title)..."

# 1. Upsert Quiz
$quizBody = $publicContent.quiz | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quizzes?on_conflict=id" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($quizBody))
Write-Host "Quiz inserted."

# 2. Upsert Sections & Questions
foreach ($section in $publicContent.sections) {
    $audioUrl = if ($section.audio) { "$storageBase/$($section.audio)" } else { $null }
    $imageUrl = if ($section.image) { "$storageBase/$($section.image)" } else { $null }

    $sectionRow = @{
        id = $section.id
        quiz_id = $publicContent.quiz.id
        title = $section.title
        instruction = $section.instruction
        section_type = $section.section_type
        position = $section.position
        audio_url = $audioUrl
        image_url = $imageUrl
    }
    $sectionBody = $sectionRow | ConvertTo-Json -Depth 5
    Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/quiz_sections?on_conflict=id" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($sectionBody))
    Write-Host "Section $($section.title) updated."

    foreach ($question in $section.questions) {
        $qRow = @{
            id = $question.id
            quiz_id = $publicContent.quiz.id
            section_id = $section.id
            position = $question.position
            question_type = $question.question_type
            prompt = $question.prompt
            points = $question.points
            metadata = if ($question.metadata) { $question.metadata } else { @{} }
        }
        $qBody = $qRow | ConvertTo-Json -Depth 5
        Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/questions?on_conflict=id" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($qBody))

        # Delete existing options for this question
        try {
            Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options?question_id=eq.$($question.id)" -Method Delete -Headers $deleteHeaders
        } catch {}

        # Insert Options
        if ($question.options -and $question.options.Count -gt 0) {
            $optionRows = @()
            $optPos = 1
            foreach ($opt in $question.options) {
                $optImageUrl = if ($opt.Count -gt 2 -and $opt[2]) { "$storageBase/$($opt[2])" } else { $null }
                $optionRows += @{
                    question_id = $question.id
                    option_key = $opt[0]
                    option_text = $opt[1]
                    image_url = $optImageUrl
                    position = $optPos
                }
                $optPos++
            }
            $optBody = $optionRows | ConvertTo-Json -Depth 5
            Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/question_options" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($optBody))
        }

        # Answer Key
        $qId = $question.id
        $ans = $privateAnswers.$qId
        if ($ans) {
            $keyRow = @{
                question_id = $question.id
                answer = $ans
            }
            $keyBody = $keyRow | ConvertTo-Json -Depth 5
            Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/answer_keys?on_conflict=question_id" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($keyBody))
        }
    }
}

Write-Host "Successfully imported $($publicContent.quiz.title) with $($publicContent.sections.Count) sections and 27 questions!"
