package com.nbweatherproject.backend

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Converter(autoApply = true)
class FlexibleLocalDateAttributeConverter : AttributeConverter<LocalDate, String> {

    companion object {
        private val FORMATTERS = arrayOf(
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd")
        )
    }

    override fun convertToDatabaseColumn(localDate: LocalDate?): String? {
        return localDate?.format(DateTimeFormatter.ISO_LOCAL_DATE)
    }

    override fun convertToEntityAttribute(dateString: String?): LocalDate? {
        if (dateString.isNullOrBlank()) {
            return null
        }

        for (formatter in FORMATTERS) {
            try {
                return LocalDate.parse(dateString, formatter)
            } catch (e: Exception) {
                // Try next formatter
            }
        }

        throw IllegalArgumentException("Unable to parse date: $dateString")
    }
}

