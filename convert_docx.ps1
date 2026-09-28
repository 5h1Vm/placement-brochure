$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 'wdAlertsNone'

$docxFiles = Get-ChildItem -Path 'd:\Hope\Brochure\public\resumes' -Filter *.docx

foreach ($file in $docxFiles) {
    Write-Host "Converting: $($file.Name)"
    $doc = $word.Documents.Open($file.FullName)
    $pdfPath = $file.FullName -replace '\.docx$', '.pdf'
    
    # 17 = wdFormatPDF
    $doc.SaveAs([ref] $pdfPath, [ref] 17)
    $doc.Close()
    
    Write-Host "Created: $pdfPath"
    Remove-Item $file.FullName -Force
}

$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
