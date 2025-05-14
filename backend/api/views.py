from rest_framework import generics, permissions
from .models import Transaction, Budget
from .serializers import TransactionSerializer, BudgetSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination

# Create your views here.

class TransactionList(generics.ListCreateAPIView): 
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination  # or define your own

    def get_queryset(self):
        user = self.request.user
        qs = Transaction.objects.filter(user=user).order_by('-date')

        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        category = self.request.query_params.get('category')
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')

        if start_date:
            qs = qs.filter(date__gte=start_date)
        if end_date:
            qs = qs.filter(date__lte=end_date)
        if category:
            qs = qs.filter(category=category)
        if min_amount:
            qs = qs.filter(amount__gte=min_amount)
        if max_amount:
            qs = qs.filter(amount__lte=max_amount)

        return qs
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)  # filter by the current user
    

class BudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get("month")
        if not month:
            return Response({"error": "Month is required"}, status=400)

        budget, _ = Budget.objects.get_or_create(user=request.user, month=month)
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)

    def put(self, request):
        month = request.query_params.get("month")
        if not month:
            return Response({"error": "Month is required"}, status=400)

        try:
            budget = Budget.objects.get(user=request.user, month=month)
        except Budget.DoesNotExist:
            budget = Budget(user=request.user, month=month)

        serializer = BudgetSerializer(budget, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def financial_summary(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user)

    income = sum(t.amount for t in transactions if t.type == 'INCOME')
    expense = sum(t.amount for t in transactions if t.type == 'EXPENSE')
    balance = income - expense

    return Response({
        'income': income,
        'expense': expense,
        'balance': balance,
    })