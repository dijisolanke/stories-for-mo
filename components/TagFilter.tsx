"use client"
import { Box, Chip, Typography, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material"
import { Clear } from "@mui/icons-material"

interface TagFilterProps {
  availableTags: string[]
  selectedTag: string
  onTagChange: (tag: string) => void
}

export default function TagFilter({ availableTags, selectedTag, onTagChange }: TagFilterProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onTagChange(event.target.value)
  }

  const handleClear = () => {
    onTagChange("")
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }} id="filter-label">
        Filter Stories
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="tag-select-label">Choose a mood</InputLabel>
          <Select
            labelId="tag-select-label"
            value={selectedTag}
            label="Choose a mood"
            onChange={handleChange}
            aria-describedby="filter-label"
            sx={{
              "& .MuiSelect-select": {
                fontSize: "1.125rem",
                py: 1.5,
              },
            }}
          >
            <MenuItem value="">
              <em>All Stories</em>
            </MenuItem>
            {availableTags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedTag && (
          <Chip
            label={`Showing: ${selectedTag}`}
            onDelete={handleClear}
            deleteIcon={<Clear />}
            color="primary"
            size="medium"
            sx={{
              fontSize: "1rem",
              py: 2,
            }}
          />
        )}
      </Box>
    </Box>
  )
}
