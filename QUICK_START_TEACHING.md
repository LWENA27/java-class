# SmartMenu SaaS - Quick Start Guide for Teachers

## 🚀 TL;DR - Start Teaching in 5 Minutes

### **Student Context:**
- **Name:** Student learning Spring Boot + React
- **Background:** PHP developer (CodeIgniter), knows MySQL
- **Goal:** Get hired for Java/Spring Boot position
- **Learning Style:** Hands-on first, explain after
- **Current Status:** Backend foundation complete, ready for CRUD APIs

### **Project Status:**
```
✅ Environment (Java 21, Maven, MongoDB Docker)
✅ Spring Boot project created
✅ 4 Models (User, MenuItem, Table, Order)
✅ 4 Repositories (database access)
✅ 4 Services (business logic)
✅ Health API working
⏳ NEXT: Build MenuItem CRUD APIs
```

---

## 🎯 What to Teach Next (Phase 8)

### **Goal:** Build complete REST API for menu items

**Files to Create:**
1. `MenuItemController.java` - REST endpoints
2. Update `MenuItemService.java` - Business logic
3. `MenuItemDTO.java` - Request/response objects

**APIs to Build:**
```
POST   /api/menu-items              → Create
GET    /api/menu-items              → Get all
GET    /api/menu-items/{id}         → Get one
PUT    /api/menu-items/{id}         → Update
DELETE /api/menu-items/{id}         → Delete
PATCH  /api/menu-items/{id}/toggle  → Toggle available
```

---

## 🏃 Quick Start Commands

### **Start Backend:**
```bash
cd /var/www/html/smart-menu-saas/backend
mvn spring-boot:run
```

### **Test It's Working:**
```bash
curl http://localhost:8080/api/health
# Should return: {"status":"UP",...}
```

### **Check MongoDB:**
```bash
sudo docker ps | grep mongodb
sudo docker exec -it mongodb mongosh
use smartmenu
db.menu_items.find()
```

---

## 📚 Quick PHP → Spring Boot Comparison

Show student these equivalents:

| PHP (CodeIgniter) | Spring Boot | Purpose |
|-------------------|-------------|---------|
| Model class | `@Entity` class | Database table |
| Query builder | `Repository` | Database queries |
| Service/Library | `@Service` class | Business logic |
| Controller method | `@RestController` | Handle requests |
| `route.php` | `@RequestMapping` | URL routing |
| `.env` | `application.properties` | Config |
| `composer.json` | `pom.xml` | Dependencies |

---

## 🎓 Teaching Flow (Use This Every Session)

### **1. Show the Goal (2 min)**
```
"Today we'll build the MenuItem API. 
You'll be able to create, read, update, delete menu items.
Just like your PHP project, but with Spring Boot."
```

### **2. Reference PHP Project (3 min)**
```bash
cd /var/www/html/smart-menu-qr/
# Show relevant PHP file
cat room_services.php
# Explain: "This is what we're rebuilding"
```

### **3. Build Together (30-40 min)**
- Create DTO class
- Add service method
- Add controller endpoint
- Test with curl
- **Explain as you go!**

### **4. Test Together (10 min)**
```bash
# Create menu item
curl -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "test-rest-1",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza",
    "price": 12.99,
    "category": "Pizza",
    "imageUrl": "http://example.com/pizza.jpg",
    "available": true
  }'

# Get all items
curl http://localhost:8080/api/menu-items

# Show in MongoDB
sudo docker exec -it mongodb mongosh
use smartmenu
db.menu_items.find().pretty()
```

### **5. Explain What Happened (5 min)**
```
Controller → Service → Repository → MongoDB

HTTP Request → @PostMapping → service.create() → 
repository.save() → MongoDB → HTTP Response
```

### **6. Check Understanding (5 min)**
Ask:
- "What does @PostMapping do?"
- "Why do we use DTOs instead of models?"
- "How is this different from PHP?"

---

## 💡 Key Teaching Moments

### **When Student Makes Mistakes:**

❌ **Error: "No plugin found for prefix 'spring-boot'"**
```
✅ Explain: "Maven commands need pom.xml. 
You're in the wrong directory.
cd to /var/www/html/smart-menu-saas/backend first."
```

❌ **Error: "Cannot deserialize JSON"**
```
✅ Explain: "JSON field names must match Java field names.
Use @JsonProperty if they're different.
Or use DTOs to control the contract."
```

❌ **Error: "NullPointerException"**
```
✅ Explain: "In Java, check for null or use Optional<T>.
Unlike PHP, null isn't handled automatically.
This is actually safer - forces you to handle missing data."
```

---

## 🧪 Testing Checklist

After each feature, verify:
- [ ] Code compiles: `mvn compile`
- [ ] App starts: `mvn spring-boot:run`
- [ ] API works: `curl http://localhost:8080/api/...`
- [ ] Data in DB: `mongosh → db.collection.find()`
- [ ] Logs look good: Check console output
- [ ] Student can explain it
- [ ] Student can test it alone

---

## 🗺️ Full Roadmap

```
Phase 8:  MenuItem CRUD APIs        ← YOU ARE HERE
Phase 9:  JWT Authentication
Phase 10: React Frontend Setup
Phase 11: Admin Dashboard (React)
Phase 12: Customer Menu View (React)
Phase 13: QR Code Generation
Phase 14: Kitchen Dashboard
Phase 15: Docker & Deployment
```

---

## 📝 Session Template

Use this structure every session:

### **Start (5 min):**
1. "What did we learn last time?"
2. "Any questions or errors since then?"
3. Check backend is running

### **Teach (40 min):**
1. Show PHP equivalent
2. Design API together
3. Write code together
4. Test together
5. Explain what happened

### **End (10 min):**
1. Review what was built
2. Test one more time
3. Ask comprehension questions
4. Preview next session

---

## 🎯 Student's Learning Goals

Match teaching to job requirements:

| Job Requirement | How We Teach It | Status |
|----------------|-----------------|--------|
| Spring Boot REST APIs | Build CRUD APIs | Phase 8 (next) |
| Spring Data MongoDB | Use repositories | ✅ Done |
| Spring Security | JWT auth | Phase 9 |
| React.js | Frontend | Phase 10-14 |
| Microservices | Architecture patterns | Throughout |
| MongoDB aggregation | Advanced queries | Phase 13+ |
| Problem-solving | Debug together | Every session |

---

## 🚨 Common Issues & Solutions

### **Backend won't start:**
```bash
# Check MongoDB is running
sudo docker ps | grep mongodb

# Check port 8080 is free
lsof -i :8080

# Check logs
tail -f /tmp/smartmenu-backend.log
```

### **Can't connect to MongoDB:**
```bash
# Restart container
sudo docker restart mongodb

# Check connection in application.properties
cat backend/src/main/resources/application.properties
```

### **Maven errors:**
```bash
# Clean and rebuild
cd backend
mvn clean install -DskipTests
```

---

## 📞 Quick Reference

**Project Root:** `/var/www/html/smart-menu-saas/`

**PHP Reference:** `/var/www/html/smart-menu-qr/`

**Backend:** http://localhost:8080

**Swagger Docs:** http://localhost:8080/swagger-ui.html

**MongoDB:** localhost:27017/smartmenu

**Full Guide:** See `TEACHING_GUIDE.md` for detailed documentation

---

## 🎓 Teaching Principles

1. **Hands-On First** - Build it, then explain it
2. **Compare to PHP** - Always relate to what they know
3. **Test Together** - Never skip testing
4. **Challenge Them** - Make them think, don't just give answers
5. **Celebrate Wins** - Small successes build confidence

---

## ✅ Ready to Teach!

**Next Action:** Build MenuItem CRUD APIs (Phase 8)

**Estimated Time:** 2-3 sessions (1 hour each)

**Expected Outcome:** Student can build REST APIs independently

**Success Metric:** Student explains controller → service → repository flow

---

*Keep this guide open during teaching sessions. Update after major milestones.*

**Last Updated:** November 20, 2025
